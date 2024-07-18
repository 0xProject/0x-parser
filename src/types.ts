import type {
  Hex,
  Hash,
  Chain,
  Address,
  Transport,
  PublicClient,
  TransactionReceipt,
} from "viem";

export type SupportedChainId = 1 | 10 | 56 | 137 | 8453 | 42161 | 43114;

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

export interface Trace {
  to: Address;
  from: Address;
  gas: Hex;
  gasUsed: Hex;
  input: "Hash";
  output: Hash;
  calls: Trace[];
  value: Hex;
  type: "CALL" | "STATICCALL" | "DELEGATECALL" | "CREATE" | "CREATE2";
}

export type TraceTransactionSchema = {
  Parameters: [
    hash: Hash,
    options:
      | {
          disableStorage?: boolean;
          disableStack?: boolean;
          enableMemory?: boolean;
          enableReturnData?: boolean;
          tracer?: string;
        }
      | {
          timeout?: string;
          tracerConfig?: {
            onlyTopCall?: boolean;
            withLog?: boolean;
          };
        }
      | undefined
  ];
  ReturnType: Trace;
};
