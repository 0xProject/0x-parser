import { EVENT_SIGNATURES } from "../constants";
import type { TransactionReceipt } from "ethers";
import type {
  Log,
  ProcessedLog,
  EnrichedTxReceipt,
  EnrichedLogWithoutAmount,
} from "../types";

export function convertHexToAddress(hexString: string): string {
  return `0x${hexString.slice(-40)}`;
}

export function parseHexDataToString(hexData: string) {
  const dataLength = parseInt(hexData.slice(66, 130), 16);
  const data = hexData.slice(130, 130 + dataLength * 2);
  const bytes: Uint8Array = new Uint8Array(
    data.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) ?? []
  );
  const textDecoder = new TextDecoder();
  const utf8String = textDecoder.decode(bytes);

  return utf8String;
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

async function rpcCall({
  rpcUrl,
  method,
  params = [],
}: {
  rpcUrl: string;
  method: string;
  params?: unknown[];
}) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  return await response.json();
}

export const erc20Rpc = {
  getSymbol: async function (contractAddress: string, rpcUrl: string) {
    const SYMBOL_FUNCTION_HASH = "0x95d89b41";
    const { result } = await rpcCall({
      rpcUrl,
      method: "eth_call",
      params: [{ to: contractAddress, data: SYMBOL_FUNCTION_HASH }, "latest"],
    });

    return parseHexDataToString(result);
  },
  getDecimals: async function (contractAddress: string, rpcUrl: string) {
    const DECIMALS_FUNCTION_HASH = "0x313ce567";
    const { result } = await rpcCall({
      rpcUrl,
      method: "eth_call",
      params: [{ to: contractAddress, data: DECIMALS_FUNCTION_HASH }, "latest"],
    });

    return Number(BigInt(result));
  },
};

async function enrichLog({
  log,
  rpcUrl,
}: {
  log: Log;
  rpcUrl: string;
}): Promise<EnrichedLogWithoutAmount> {
  const [symbol, decimals] = await Promise.all([
    erc20Rpc.getSymbol(log.address, rpcUrl),
    erc20Rpc.getDecimals(log.address, rpcUrl),
  ]);

  return { ...log, symbol, decimals };
}

function processLog(log: EnrichedLogWithoutAmount): ProcessedLog {
  const { topics, data, decimals, symbol, address } = log;
  const { 1: fromHex, 2: toHex } = topics;
  const from = convertHexToAddress(fromHex);
  const to = convertHexToAddress(toHex);
  const amount = formatUnits(data, decimals);

  return { to, from, symbol, amount, address, decimals };
}

export async function enrichTxReceipt({
  txReceipt,
  rpcUrl,
}: {
  txReceipt: TransactionReceipt;
  rpcUrl: string;
}): Promise<EnrichedTxReceipt> {
  const isERC20TransferEvent = (log: Log) =>
    log.topics[0] === EVENT_SIGNATURES.Transfer;
  const filteredLogs = txReceipt.logs.filter(isERC20TransferEvent);
  const enrichedLogs = await Promise.all(
    filteredLogs.map((log) => enrichLog({ log, rpcUrl }))
  );
  const logs = enrichedLogs.map(processLog);

  return { logs, from: txReceipt.from };
}

export function extractTokenInfo(
  inputLog: ProcessedLog,
  outputLog: ProcessedLog
) {
  return {
    tokenIn: {
      symbol: inputLog.symbol,
      amount: inputLog.amount,
      address: inputLog.address,
    },
    tokenOut: {
      symbol: outputLog.symbol,
      amount: outputLog.amount,
      address: outputLog.address,
    },
  };
}
