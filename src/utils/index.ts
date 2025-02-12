import { fromHex, erc20Abi, getAddress, formatUnits, formatEther } from "viem";
import {
  bsc,
  base,
  mode,
  blast,
  linea,
  scroll,
  mantle,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  unichain,
  avalanche,
  worldchain,
} from "viem/chains";
import { NATIVE_SYMBOL_BY_CHAIN_ID, NATIVE_TOKEN_ADDRESS } from "../constants";
import type { Address } from "viem";
import type {
  Trace,
  EnrichedLog,
  EnrichLogsArgs,
  SupportedChainId,
} from "../types";

export function isChainIdSupported(
  chainId: number
): chainId is SupportedChainId {
  const supportedChainIds: number[] = [
    bsc.id,
    base.id,
    mode.id,
    blast.id,
    linea.id,
    scroll.id,
    mantle.id,
    polygon.id,
    mainnet.id,
    arbitrum.id,
    optimism.id,
    unichain.id,
    avalanche.id,
    worldchain.id,
  ];
  return supportedChainIds.includes(chainId);
}

export function calculateNativeTransfer(
  trace: Trace,
  options: { recipient: Address; direction?: "to" | "from" }
): string {
  const { recipient, direction = "to" } = options;
  let totalTransferred = 0n;
  const recipientLower = recipient.toLowerCase();

  function processCall(call: Trace) {
    if (!call.value) return;

    const relevantAddress = direction === "from" ? call.from : call.to;

    if (relevantAddress.toLowerCase() === recipientLower) {
      totalTransferred += fromHex(call.value, "bigint");
    }
  }

  function traverseCalls(calls: Trace[]) {
    for (const call of calls) {
      processCall(call);
      if (call.calls && call.calls.length > 0) {
        traverseCalls(call.calls);
      }
    }
  }

  traverseCalls(trace.calls);

  return formatEther(totalTransferred);
}

export async function transferLogs({
  publicClient,
  transactionReceipt,
}: EnrichLogsArgs): Promise<EnrichedLog[]> {
  const EVENT_SIGNATURES = {
    Transfer: `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`,
  } as const;
  const transferLogsAddresses = transactionReceipt.logs
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
      const amountRaw = log.data === "0x" ? 0n : BigInt(log.data);
      const { address, topics } = log;
      const { 1: fromHex, 2: toHex } = topics;
      const from = getAddress(convertHexToAddress(fromHex));
      const to = getAddress(convertHexToAddress(toHex));

      return { to, from, symbol, amount, amountRaw, address, decimals };
    })
    .filter((log) => log.amount !== "0");

  return enrichedLogs;
}

function convertHexToAddress(hexString: string): string {
  return `0x${hexString.slice(-40)}`;
}

export function parseSmartContractWalletTx({
  logs,
  trace,
  chainId,
  smartContractWallet,
}: {
  logs: EnrichedLog[];
  trace: Trace;
  chainId: SupportedChainId;
  smartContractWallet: Address;
}) {
  const smartContractWalletTransferLogs = logs.reduce<{
    output?: EnrichedLog;
    input?: EnrichedLog;
  }>((acc, curr) => {
    if (curr.to === smartContractWallet) return { ...acc, output: curr };
    if (curr.from === smartContractWallet) return { ...acc, input: curr };
    return acc;
  }, {});

  let { input, output } = smartContractWalletTransferLogs;

  const nativeAmountToTaker = calculateNativeTransfer(trace, {
    recipient: smartContractWallet,
  });

  const nativeAmountFromTaker = calculateNativeTransfer(trace, {
    recipient: smartContractWallet,
    direction: "from",
  });

  if (!output && nativeAmountToTaker !== "0") {
    if (input) {
      return {
        tokenIn: {
          address: input.address,
          amount: input.amount,
          symbol: input.symbol,
        },
        tokenOut: {
          address: NATIVE_TOKEN_ADDRESS,
          amount: nativeAmountToTaker,
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        },
      };
    } else {
      return null;
    }
  }

  if (!input && nativeAmountFromTaker !== "0") {
    const wrappedNativeAsset =
      chainId === 56 ? "WBNB" : chainId === 137 ? "WPOL" : "WETH";

    const inputLog = logs.find((log) => log.symbol === wrappedNativeAsset);

    if (inputLog && output) {
      return {
        tokenIn: {
          address: NATIVE_TOKEN_ADDRESS,
          amount: inputLog.amount,
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        },
        tokenOut: {
          address: output.address,
          amount: output.amount,
          symbol: output.symbol,
        },
      };
    } else {
      return null;
    }
  }

  if (input && output) {
    return {
      tokenIn: {
        address: input.address,
        amount: input.amount,
        symbol: input.symbol,
      },
      tokenOut: {
        address: output.address,
        amount: output.amount,
        symbol: output.symbol,
      },
    };
  }

  return null;
}
