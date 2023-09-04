import { permitAndCallAbi } from "./abi/PermitAndCall";
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

export interface TransformERC20Args {
  taker: Address;
  inputToken: Address;
  outputToken: Address;
  inputTokenAmount: bigint;
  outputTokenAmount: bigint;
}

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

type Token = {
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

export type ParserArgs = {
  callData: Hex;
  transaction: Transaction;
  chainId?: SupportedChainId;
  transactionReceipt: TransactionReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbi;
  publicClient: PublicClient<Transport, Chain>;
};

export type ParserFunction = (
  args: ParserArgs
) => TokenTransaction | Promise<TokenTransaction | undefined>;

export interface Parsers {
  [key: string]: ParserFunction;
}

export type ParseSwap = (
  args: ParseSwapArgs
) => Promise<TokenTransaction | null>;

export type PermitAndCall = Extract<
  (typeof permitAndCallAbi)[number],
  { name: "permitAndCall" }
>;

export type ExecuteMetaTransaction = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "executeMetaTransaction" }
>;

export type ExecuteMetaTransactionV2 = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "executeMetaTransactionV2" }
>;

export type FillTakerSignedOtcOrder = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "fillTakerSignedOtcOrder" }
>;

export type FillOtcOrderForEth = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "fillOtcOrderForEth" }
>;

export type FillOtcOrderWithEth = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "fillOtcOrderWithEth" }
>;

export type FillLimitOrder = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "fillLimitOrder" }
>;

export type MultiplexBatchSellTokenForToken = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "multiplexBatchSellTokenForToken" }
>;

export type MultiplexBatchSellEthForToken = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "multiplexBatchSellEthForToken" }
>;

export type MultiplexBatchSellTokenForEth = Extract<
  (typeof exchangeProxyAbi)[number],
  { name: "multiplexBatchSellTokenForEth" }
>;
