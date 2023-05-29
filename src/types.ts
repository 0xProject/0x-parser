import { type Contract } from "ethers";

export type Mtx = [
  signer: string,
  sender: string,
  expirationTimeSeconds: bigint,
  salt: bigint,
  calldata: string,
  feeToken: string,
  fees: [[recipient: string]],
]

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
  };
}

export interface ParseSwapArgs {
  transactionHash: string;
  exchangeProxyAbi?: any;
  // txReceipt: TransactionReceipt;
  // txDescription: TxDescription;
  rpcUrl: string;
}

type TxParams = {
  txDescription: TxDescription;
  txReceipt: EnrichedTxReceipt;
  contract?: Contract;
};

type TokenTransaction = { tokenIn: Token; tokenOut: Token } | undefined;

type Token = {
  symbol: string;
  amount: string;
};

type ParserFunction = (params: TxParams) => TokenTransaction;


export interface LogParsers {
  [key: string]: ParserFunction;
}
