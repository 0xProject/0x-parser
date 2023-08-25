import { EVENT_SIGNATURES } from "../constants";
import { minimalERC20Abi } from "../abi/MinimalERC20";
import type {
  ProcessedLog,
  SupportedChainId,
  EnrichedTxReceipt,
  PermitAndCallChainIds,
  EnrichedTxReceiptArgsForViem,
} from "../types";

import { getAddress } from "viem";

export function convertHexToAddress(hexString: string): string {
  return `0x${hexString.slice(-40)}`;
}

export function isChainIdSupported(
  chainId: number
): chainId is SupportedChainId {
  return [1, 5, 10, 56, 137, 250, 8453, 42220, 43114, 42161].includes(chainId);
}

export function isPermitAndCallChainId(
  chainId: number
): chainId is PermitAndCallChainIds {
  return [1, 137, 8453].includes(chainId);
}

export function formatUnits(data: string, decimals: number) {
  const bigIntData = BigInt(data);
  const bigIntDecimals = BigInt(10 ** decimals);
  const wholePart = bigIntData / bigIntDecimals;
  const fractionalPart = bigIntData % bigIntDecimals;
  const paddedFractionalPart = String(fractionalPart).padStart(decimals, "0");
  const formattedFractionalPart = paddedFractionalPart.replace(/0+$/, "");

  return formattedFractionalPart.length > 0
    ? `${wholePart}.${formattedFractionalPart}`
    : wholePart.toString();
}

export async function enrichTxReceiptForViem({
  transactionReceipt,
  publicClient,
}: EnrichedTxReceiptArgsForViem): Promise<EnrichedTxReceipt> {
  const { from: viemFrom, logs: viemLogs } = transactionReceipt;

  const transferLogsAddresses = viemLogs
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

  const enrichedLogs = transferLogsAddresses.map((log, index) => {
    const symbol = results[index].result as string;
    const decimals = results[midpoint + index].result as number;
    const amount = formatUnits(log.data, decimals as number);
    const { address, topics } = log;
    const { 1: fromHex, 2: toHex } = topics;
    const from = getAddress(convertHexToAddress(fromHex));
    const to = getAddress(convertHexToAddress(toHex));

    return { to, from, symbol, amount, address, decimals };
  });

  return { from: getAddress(viemFrom), logs: enrichedLogs };
}

export function extractTokenInfo(
  inputLog: ProcessedLog,
  outputLog: ProcessedLog
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
