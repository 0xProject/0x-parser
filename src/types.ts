import { narrow } from "abitype";
import IZeroEx from "./abi/IZeroEx.json";
import { Chain, PublicClient, Transport } from "viem";
import type {
  Transaction,
  TransactionReceipt,
} from "viem";

export type PermitAndCallChainIds = 1 | 137 | 8453;

export type SupportedChainId =
  | 1
  | 5
  | 10
  | 56
  | 137
  | 250
  | 8453
  | 42220
  | 43114
  | 42161;

export interface CallResult {
  success: boolean;
  returnData: string;
}

type BlockHash = string;

export type AggregateResponse = [bigint, BlockHash, CallResult[]];

export const exchangeProxyAbi = narrow(IZeroEx.compilerOutput.abi);

export type Mtx = {
  signer: string;
  sender: string;
  expirationTimeSeconds: bigint;
  salt: bigint;
  callData: `0x${string}`;
  feeToken: string;
  fees: [{ recipient: string }];
};

interface Signature {
  signatureType: number;
  v: number;
  r: string;
  s: string;
}

export type MetaTransactionArgs = [Mtx, Signature];

export interface TransformERC20Args {
  taker: `0x${string}`;
  inputToken: `0x${string}`;
  outputToken: `0x${string}`;
  inputTokenAmount: bigint;
  outputTokenAmount: bigint;
}

export type MultiplexBatchSellTokenForEthArgs = [
  `0x${string}`,
  { id: number; sellAmount: bigint; data: `0x${string}` }[],
  bigint,
  bigint
];

interface FillTakerSignedOtcOrderOrder {
  makerToken: `0x${string}`;
  takerToken: `0x${string}`;
  makerAmount: bigint;
  takerAmount: bigint;
  maker: `0x${string}`;
  taker: `0x${string}`;
  txOrigin: `0x${string}`;
  expiryAndNonce: bigint;
}

interface MakerSignature extends Signature {}

interface TakerSignature extends Signature {}

export type FillTakerSignedOtcOrderArgs = [
  FillTakerSignedOtcOrderOrder,
  MakerSignature,
  TakerSignature
];

interface FillLimitOrderOrder {
  makerToken: `0x${string}`;
  takerToken: `0x${string}`;
  makerAmount: bigint;
  takerAmount: bigint;
  takerTokenFeeAmount: bigint;
  maker: `0x${string}`;
  taker: `0x${string}`;
  sender: `0x${string}`;
  feeRecipient: `0x${string}`;
  pool: `0x${string}`;
  expiry: bigint;
  salt: bigint;
}

export type FillLimitOrderArgs = [FillLimitOrderOrder, Signature, bigint];

export type MultiplexBatchSellEthForTokenArgs = [
  `0x${string}`,
  { id: number; sellAmount: bigint; data: `0x${string}` }[],
  bigint
];

export type MultiplexBatchSellTokenForTokenArgs = [
  `0x${string}`,
  `0x${string}`,
  { id: number; sellAmount: bigint; data: `0x${string}` }[],
  bigint,
  bigint
];

interface ExecuteMetaTransactionMtx {
  signer: `0x${string}`;
  sender: `0x${string}`;
  minGasPrice: bigint;
  maxGasPrice: bigint;
  expirationTimeSeconds: bigint;
  salt: bigint;
  callData: `0x${string}`;
  value: bigint;
  feeToken: `0x${string}`;
  feeAmount: bigint;
}

export type ExecuteMetaTransactionArgs = [ExecuteMetaTransactionMtx, Signature];

export type FillOtcOrderForEthArgs = [
  {
    makerToken: `0x${string}`;
    takerToken: `0x${string}`;
    makerAmount: bigint;
    takerAmount: bigint;
    maker: `0x${string}`;
    taker: `0x${string}`;
    txOrigin: `0x${string}`;
    expiryAndNonce: bigint;
  },
  Signature,
  bigint
];

export type PermitAndCallArgs = [
  `0x${string}`,
  `0x${string}`,
  bigint,
  bigint,
  number,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`
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

export interface EnrichedTxReceiptArgsForViem {
  transactionReceipt: TransactionReceipt;
  publicClient: PublicClient<Transport, Chain>;
}

export interface ProcessReceiptArgsForViem {
  signer: string;
  recipient: string;
  parser: ParserFunction;
  transactionReceipt: TransactionReceipt;
  transaction: Transaction;
  exchangeProxyAbi: typeof exchangeProxyAbi;
}

export enum TransactionStatus {
  REVERTED = "reverted",
  SUCCESS = "success",
}

export interface LogViem {
  transactionIndex: number | null;
  blockNumber: bigint | null;
  transactionHash: `0x${string}` | null;
  address: string;
  data: `0x${string}`;
  logIndex?: number | null;
  blockHash: `0x${string}` | null;
  topics: readonly string[];
}

export interface EnrichedLogWithoutAmountViem extends LogViem {
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
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbi;
  callData: `0x${string}`;
  publicClient?: PublicClient<Transport, Chain>;
};

export type ParserFunction = (params: TxParams) => TokenTransaction;

export interface LogParsers {
  [key: string]: ParserFunction;
}

export type TransformERC20EventData = [string, string, string, bigint, bigint];

export interface ParseMetaTransactionV2Args {
  logParsers: LogParsers;
  chainId: SupportedChainId;
  publicClient: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbi;
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
  callDataMtx?: any;
}

export type ParseSwap = (
  args: ParseSwapArgs
) => Promise<TokenTransaction | null>;
