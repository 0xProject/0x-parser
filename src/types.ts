export interface ProcessedLog {
  to: string;
  from: string;
  symbol: string;
  amount: string;
  address: string;
  decimals: number;
}

export interface EnrichedTxReceipt {
  logs: ProcessedLog[];
  from: string;
}

export enum TransactionStatus {
  REVERTED = 0,
  SUCCESSFUL = 1,
}

export interface Log {
  transactionIndex: number;
  blockNumber: number;
  transactionHash: string;
  address: string;
  data: string;
  logIndex?: number;
  blockHash: string;
  topics: readonly string[];
}

export interface EnrichedLogWithoutAmount extends Log {
  symbol: string;
  decimals: number;
  from?: string;
}

export interface TransactionReceipt {
  logs: readonly Log[];
  from: string;
  status: number | null;
}

// generic here.
export interface TxDescription {
  value: bigint;
  name: string;
  args: (string | bigint)[] | (string | bigint)[][];
  fragment?: {
    inputs: readonly any[];
  }
}

export interface ParseSwapArgs {
  transactionHash: string;
  exchangeProxyAbi?: any;
  // txReceipt: TransactionReceipt;
  // txDescription: TxDescription;
  rpcUrl: string;
}

type ParserFunction = (params: {
  txDescription: TxDescription;
  txReceipt: EnrichedTxReceipt;
}) => {
  tokenIn: { symbol: string; amount: string };
  tokenOut: { symbol: string; amount: string };
} | undefined;

export interface LogParsers {
  [key: string]: ParserFunction;
}
