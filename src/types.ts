import {
  type Contract,
  type TransactionReceipt as EthersTransactionReceipt,
} from "ethers";

export type Mtx = [
  signer: string,
  sender: string,
  expirationTimeSeconds: bigint,
  salt: bigint,
  calldata: string,
  feeToken: string,
  fees: [[recipient: string]]
];

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
  rpcUrl: string;
}

type Token = {
  symbol: string;
  amount: string;
};

type TokenTransaction = {
  tokenIn: Token;
  tokenOut: Token;
} | undefined;

type DetailedTokenTransaction = {
  tokenIn: Token & { address: string };
  tokenOut: Token & { address: string };
} | undefined;

type TxParams = {
  txDescription: TxDescription;
  txReceipt: EnrichedTxReceipt;
};

interface TxParamsFull extends TxParams {
  transactionReceipt?: EthersTransactionReceipt;
  contract?: Contract;
  rpcUrl?: string;
};

type ParserFunction = (params: TxParams) => TokenTransaction;

type AsyncParserFunction = (params: TxParamsFull) => Promise<DetailedTokenTransaction>;

export interface LogParsers {
  [key: string]: ParserFunction | AsyncParserFunction;
}

export type TransformERC20EventData = [string, string, string, bigint, bigint];
