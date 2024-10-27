import {
  bsc,
  base,
  mode,
  blast,
  linea,
  scroll,
  mantle,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  avalanche,
} from "viem/chains";

import type {
  Hex,
  Hash,
  Chain,
  Address,
  Transport,
  PublicClient,
  TransactionReceipt,
} from "viem";

export type SupportedChainId =
  | typeof bsc.id
  | typeof base.id
  | typeof mode.id
  | typeof blast.id
  | typeof linea.id
  | typeof scroll.id
  | typeof mantle.id
  | typeof mainnet.id
  | typeof polygon.id
  | typeof arbitrum.id
  | typeof optimism.id
  | typeof avalanche.id;

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
