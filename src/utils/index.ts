import { getAddress, formatUnits } from "viem";
import { EVENT_SIGNATURES } from "../constants";
import { minimalERC20Abi } from "../abi/MinimalERC20";
import type {
  EnrichedLog,
  EnrichLogsArgs,
  SupportedChainId,
  PermitAndCallChainIds,
} from "../types";

function convertHexToAddress(hexString: string): string {
  return `0x${hexString.slice(-40)}`;
}

export function isChainIdSupported(
  chainId?: number
): chainId is SupportedChainId {
  if (!chainId) return false;
  return [1, 5, 10, 56, 137, 250, 8453, 42220, 43114, 42161].includes(chainId);
}

export function isPermitAndCallChainId(
  chainId: number
): chainId is PermitAndCallChainIds {
  return [1, 137, 8453].includes(chainId);
}

export async function transferLogs({
  publicClient,
  transactionReceipt,
}: EnrichLogsArgs): Promise<EnrichedLog[]> {
  const { logs } = transactionReceipt;

  const transferLogsAddresses = logs
    .filter((log) => log.topics[0] === EVENT_SIGNATURES.Transfer)
    .map((log) => ({ ...log, address: getAddress(log.address) }));

  const contracts = [
    ...transferLogsAddresses.map((log) => ({
      abi: minimalERC20Abi,
      address: log.address,
      functionName: "symbol",
    })),
    ...transferLogsAddresses.map((log) => ({
      abi: minimalERC20Abi,
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
      const amount = formatUnits(BigInt(log.data), decimals);
      const { address, topics } = log;
      const { 1: fromHex, 2: toHex } = topics;
      const from = getAddress(convertHexToAddress(fromHex));
      const to = getAddress(convertHexToAddress(toHex));

      return { to, from, symbol, amount, address, decimals };
    })
    .filter((log) => log.amount !== "0");

  return enrichedLogs;
}

export function extractTokenInfo(
  inputLog: EnrichedLog,
  outputLog: EnrichedLog
) {
  return {
    tokenIn: {
      symbol: inputLog.symbol,
      amount: inputLog.amount,
      address: getAddress(inputLog.address),
    },
    tokenOut: {
      symbol: outputLog.symbol,
      amount: outputLog.amount,
      address: getAddress(outputLog.address),
    },
  };
}
