import { narrow } from "abitype";
import IZeroEx from "./abi/IZeroEx.json";
import type {
  Contract,
  BaseContractMethod,
  TransactionReceipt,
  TransactionDescription,
} from "ethers";

export type SupportedChainId = 1 | 5 | 10 | 56 | 137 | 250 | 8453 | 42220 | 43114 | 42161;

export interface CallResult {
  success: boolean;
  returnData: string;
}

interface Call {
  target: string;
  callData: string;
}

type BlockHash = string;

export type AggregateResponse = [bigint, BlockHash, CallResult[]];

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

export type TryBlockAndAggregate = BaseContractMethod<
  [boolean, Call[]],
  AggregateResponse
>;

export interface EnrichedTxReceiptArgs {
  transactionReceipt: TransactionReceipt;
  tryBlockAndAggregate: TryBlockAndAggregate;
}

export interface ProcessReceiptArgs {
  signer: string;
  recipient: string;
  parser: ParserFunction;
  transactionReceipt: TransactionReceipt;
  tryBlockAndAggregate: TryBlockAndAggregate;
  transactionDescription: TransactionDescription;
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

export type Token = {
  symbol: string;
  amount: string;
  address: string;
};

export type TokenTransaction =
  | {
      tokenIn: Token;
      tokenOut: Token;
    }
  | undefined;

type TxParams = {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
};

export type ParserFunction = (params: TxParams) => TokenTransaction;

export interface LogParsers {
  [key: string]: ParserFunction;
}

export type TransformERC20EventData = [string, string, string, bigint, bigint];

export interface ParseGaslessTxArgs {
  logParsers: LogParsers;
  chainId: SupportedChainId;
  exchangeProxyContract: Contract;
  tryBlockAndAggregate: TryBlockAndAggregate;
  transactionReceipt: TransactionReceipt;
  transactionDescription: TransactionDescription;
}

export type ParseSwap = (
  args: ParseSwapArgs
) => Promise<TokenTransaction | null>;
