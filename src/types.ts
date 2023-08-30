import { narrow } from "abitype";
import IZeroEx from "./abi/IZeroEx.json";
import type {
  Hex,
  Chain,
  Address,
  Transport,
  Transaction,
  PublicClient,
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

export const exchangeProxyAbi = narrow(IZeroEx.compilerOutput.abi);

export type Mtx = {
  signer: Address;
  sender: Address;
  expirationTimeSeconds: bigint;
  salt: bigint;
  callData: Hex;
  feeToken: Address;
  fees: [{ recipient: Address }];
};

interface Signature {
  signatureType: number;
  v: number;
  r: string;
  s: string;
}

export type MetaTransactionArgs = [Mtx, Signature];

export interface TransformERC20Args {
  taker: Address;
  inputToken: Address;
  outputToken: Address;
  inputTokenAmount: bigint;
  outputTokenAmount: bigint;
}

export type MultiplexBatchSellTokenForEthArgs = [
  Address,
  { id: number; sellAmount: bigint; data: Hex }[],
  bigint,
  bigint
];

interface FillTakerSignedOtcOrderOrder {
  makerToken: Address;
  takerToken: Address;
  makerAmount: bigint;
  takerAmount: bigint;
  maker: Address;
  taker: Address;
  txOrigin: Address;
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
  makerToken: Address;
  takerToken: Address;
  makerAmount: bigint;
  takerAmount: bigint;
  takerTokenFeeAmount: bigint;
  maker: Address;
  taker: Address;
  sender: Address;
  feeRecipient: Address;
  pool: Address;
  expiry: bigint;
  salt: bigint;
}

export type FillLimitOrderArgs = [FillLimitOrderOrder, Signature, bigint];

export type MultiplexBatchSellEthForTokenArgs = [
  Address,
  { id: number; sellAmount: bigint; data: Hex }[],
  bigint
];

export type MultiplexBatchSellTokenForTokenArgs = [
  Address,
  Address,
  { id: number; sellAmount: bigint; data: Hex }[],
  bigint,
  bigint
];

interface ExecuteMetaTransactionMtx {
  signer: Address;
  sender: Address;
  minGasPrice: bigint;
  maxGasPrice: bigint;
  expirationTimeSeconds: bigint;
  salt: bigint;
  callData: Hex;
  value: bigint;
  feeToken: Address;
  feeAmount: bigint;
}

export type ExecuteMetaTransactionArgs = [ExecuteMetaTransactionMtx, Signature];

export type FillOtcOrderForEthArgs = [
  {
    makerToken: Address;
    takerToken: Address;
    makerAmount: bigint;
    takerAmount: bigint;
    maker: Address;
    taker: Address;
    txOrigin: Address;
    expiryAndNonce: bigint;
  },
  MakerSignature,
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
  Hex
];

export interface ProcessedLog {
  to: Address;
  from: Address;
  symbol: string;
  amount: string;
  address: Address;
  decimals: number;
}

export interface EnrichedTxReceipt {
  logs: ProcessedLog[];
  from: Address;
}

export interface EnrichedTxReceiptArgsForViem {
  transactionReceipt: TransactionReceipt;
  publicClient: PublicClient<Transport, Chain>;
}

export interface ProcessReceiptArgsForViem {
  signer: Address;
  recipient: Address;
  parser: ParserFunction;
  transactionReceipt: TransactionReceipt;
  transaction: Transaction;
  exchangeProxyAbi: typeof exchangeProxyAbi;
}

export interface LogViem {
  transactionIndex: number | null;
  blockNumber: bigint | null;
  transactionHash: Hex | null;
  address: Address;
  data: Hex;
  logIndex?: number | null;
  blockHash: Hex | null;
  topics: readonly string[];
}

export interface EnrichedLogWithoutAmountViem extends LogViem {
  symbol: string;
  decimals: number;
  from?: Address;
}

export interface ParseSwapArgs {
  transactionHash: Hex;
  exchangeProxyAbi?: typeof exchangeProxyAbi;
  rpcUrl: string;
}

export type Token = {
  symbol?: string;
  amount: string;
  address: string;
};

export type TokenTransaction =
  | {
      tokenIn: Token;
      tokenOut: Token;
    }
  | undefined;

type ParserParams = {
  chainId?: SupportedChainId;
  txReceipt: EnrichedTxReceipt;
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbi;
  callData: Hex;
  publicClient: PublicClient<Transport, Chain>;
};

export type ParserFunction = (
  params: ParserParams
) => TokenTransaction | Promise<TokenTransaction | undefined>;

export interface LogParsers {
  [key: string]: ParserFunction;
}

export interface ParseMetaTransactionV2Args {
  chainId?: SupportedChainId;
  publicClient?: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbi;
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
  callData: Hex;
}

export type ParseSwap = (
  args: ParseSwapArgs
) => Promise<TokenTransaction | null>;
