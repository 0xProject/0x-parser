import { exchangeProxyAbi } from "./abi/ExchangeProxyAbi";
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

interface Signature {
  signatureType: number;
  v: number;
  r: string;
  s: string;
}

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

interface OtcOrder {
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
  OtcOrder,
  MakerSignature,
  TakerSignature
];

interface LimitOrder {
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

export type FillLimitOrderArgs = [LimitOrder, Signature, bigint];

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

type MetaTransactionV2 = {
  signer: Address;
  sender: Address;
  expirationTimeSeconds: bigint;
  salt: bigint;
  callData: Hex;
  feeToken: Address;
  fees: [{ recipient: Address }];
};

interface MetaTransaction extends MetaTransactionV2 {
  minGasPrice: bigint;
  maxGasPrice: bigint;
  value: bigint;
  feeAmount: bigint;
}

export type ExecuteMetaTransactionArgs = [MetaTransaction, Signature];

export type ExecuteMetaTransactionV2Args = [MetaTransactionV2, Signature];

export type FillOtcOrderForEthArgs = [OtcOrder, MakerSignature, bigint];

export type PermitAndCallArgs = [
  Address,
  Address,
  bigint,
  bigint,
  number,
  Hex,
  Hex,
  Hex
];

export interface EnrichedLog {
  to: Address;
  from: Address;
  symbol: string;
  amount: string;
  address: Address;
  decimals: number;
}

export interface EnrichLogsArgs {
  transactionReceipt: TransactionReceipt;
  publicClient: PublicClient<Transport, Chain>;
}

export interface ParseSwapArgs {
  rpcUrl: string;
  transactionHash: Hex;
  exchangeProxyAbi: typeof exchangeProxyAbi;
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
  callData: Hex;
  transaction: Transaction;
  chainId?: SupportedChainId;
  transactionReceipt: TransactionReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbi;
  publicClient: PublicClient<Transport, Chain>;
};

export type ParserFunction = (
  params: ParserParams
) => TokenTransaction | Promise<TokenTransaction | undefined>;

export interface Parsers {
  [key: string]: ParserFunction;
}

export type ParseSwap = (
  args: ParseSwapArgs
) => Promise<TokenTransaction | null>;
