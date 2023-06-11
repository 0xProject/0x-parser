import { narrow } from "abitype";
import IZeroEx from "./abi/IZeroEx.json";
import type {
  Contract,
  TransactionReceipt,
  TransactionDescription,
} from "ethers";

export const exchangeProxyAbi = narrow(IZeroEx.compilerOutput.abi);

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

export interface ParseSwapArgs {
  transactionHash: string;
  exchangeProxyAbi?: typeof exchangeProxyAbi;
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

export type DetailedTokenTransaction = {
  tokenIn: Token & { address: string };
  tokenOut: Token & { address: string };
} | undefined;

type TxParams = {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
};

type ParserFunction = (params: TxParams) => TokenTransaction;

export interface LogParsers {
  [key: string]: ParserFunction;
}

export type TransformERC20EventData = [string, string, string, bigint, bigint];

export interface ParseGaslessTxArgs {
  rpcUrl: string;
  chainId: number;
  logParsers: LogParsers;
  txReceipt: TransactionReceipt;
  txReceiptEnriched: EnrichedTxReceipt;
  exchangeProxyContract: Contract;
  transactionDescription: TransactionDescription;
}

export type ParseSwap = (args: ParseSwapArgs) => Promise<DetailedTokenTransaction>;
