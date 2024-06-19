import { erc20Abi, getAddress, formatUnits } from "viem";
import type {
  Chain,
  Address,
  Transport,
  PublicClient,
  TransactionReceipt,
} from "viem";

const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

type SupportedChainId = 1 | 10 | 56 | 137 | 8453 | 42161 | 43114;

export const NATIVE_SYMBOL_BY_CHAIN_ID: { [key in SupportedChainId]: string } =
  {
    1: "ETH", // Ethereum
    10: "ETH", // Optimism
    56: "BNB", // BNB Chain
    137: "MATIC", // Polygon
    8453: "ETH", // Base
    42161: "ETH", // Arbitrum One
    43114: "AVAX", // Avalanche
  };

export function isChainIdSupported(
  chainId: number
): chainId is SupportedChainId {
  return [1, 10, 56, 137, 8453, 42161, 43114].includes(chainId);
}

export interface EnrichLogsArgs {
  transactionReceipt: TransactionReceipt;
  publicClient: PublicClient<Transport, Chain>;
}
export interface EnrichedLog {
  to: Address;
  from: Address;
  symbol: string;
  amount: string;
  address: Address;
  decimals: number;
}

export async function transferLogs({
  publicClient,
  transactionReceipt,
}: EnrichLogsArgs): Promise<any> {
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

export async function parseSwapV2({
  publicClient,
  transactionHash,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionHash: Address;
}) {
  const chainId = await publicClient.getChainId();
  if (!isChainIdSupported(chainId)) {
    throw new Error(`chainId ${chainId} is unsupported…`);
  }

  const transactionReceipt = await publicClient.getTransactionReceipt({
    hash: transactionHash,
  });
  const { value } = await publicClient.getTransaction({
    hash: transactionHash,
  });
  const isNativeSell = value > 0n;
  const logs = await transferLogs({
    publicClient,
    transactionReceipt,
  });

  const input = logs[0];
  const output = logs[logs.length - 1];
  if (isNativeSell) {
    const sellAmount = formatUnits(value, 18);
    return {
      tokenIn: {
        symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        amount: sellAmount,
        address: NATIVE_TOKEN_ADDRESS,
      },
      tokenOut: {
        symbol: output.symbol,
        amount: output.amount,
        address: output.address,
      },
    };
  }
  return {
    tokenIn: {
      symbol: input.symbol,
      amount: input.amount,
      address: input.address,
    },
    tokenOut: {
      symbol: output.symbol,
      amount: output.amount,
      address: output.address,
    },
  };
}
