import { fromHex, erc20Abi, getAddress, formatUnits, formatEther } from "viem";
import type { Address } from "viem";
import type { Trace, EnrichLogsArgs, SupportedChainId } from "../types";

export function isChainIdSupported(
  chainId: number
): chainId is SupportedChainId {
  return [1, 10, 56, 137, 8453, 42161, 43114].includes(chainId);
}

export function extractNativeTransfer(trace: Trace, recipient: Address) {
  let totalTransferred = 0n;

  function traverseCalls(calls: Trace[]) {
    calls.forEach((call) => {
      if (
        call.to.toLowerCase() === recipient.toLowerCase() &&
        fromHex(call.value, "bigint") > 0n
      ) {
        totalTransferred = totalTransferred + fromHex(call.value, "bigint");
      }
      if (call.calls && call.calls.length > 0) {
        traverseCalls(call.calls);
      }
    });
  }

  traverseCalls(trace.calls);

  return formatEther(totalTransferred);
}

export async function transferLogs({
  publicClient,
  transactionReceipt,
}: EnrichLogsArgs): Promise<
  {
    to: `0x${string}`;
    from: `0x${string}`;
    symbol: string;
    amount: string;
    address: `0x${string}`;
    decimals: number;
  }[]
> {
  const EVENT_SIGNATURES = {
    Transfer:
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  } as const;
  const { logs } = transactionReceipt;
  const transferLogsAddresses = logs
    .filter((log) => log.topics[0] === EVENT_SIGNATURES.Transfer)
    .map((log) => ({ ...log, address: getAddress(log.address) }));
  const contracts = [
    ...transferLogsAddresses.map((log) => ({
      abi: erc20Abi,
      address: log.address,
      functionName: "symbol",
    })),
    ...transferLogsAddresses.map((log) => ({
      abi: erc20Abi,
      address: log.address,
      functionName: "decimals",
    })),
  ];
  const results = await publicClient.multicall({ contracts });
  const midpoint = Math.floor(results.length / 2);
  const enrichedLogs = transferLogsAddresses
    .map((log, index) => {
      const symbol = results[index].result as string;
      const decimals = results[midpoint + index].result as number;
      const amount =
        log.data === "0x" ? "0" : formatUnits(BigInt(log.data), decimals);
      const { address, topics } = log;
      const { 1: fromHex, 2: toHex } = topics;
      const from = getAddress(convertHexToAddress(fromHex));
      const to = getAddress(convertHexToAddress(toHex));

      return { to, from, symbol, amount, address, decimals };
    })
    .filter((log) => log.amount !== "0");

  return enrichedLogs;
}

function convertHexToAddress(hexString: string): string {
  return `0x${hexString.slice(-40)}`;
}
