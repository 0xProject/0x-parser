import {
  bsc,
  base,
  mode,
  blast,
  linea,
  scroll,
  mantle,
  plasma,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  avalanche,
  worldchain,
  berachain,
  unichain,
  monad,
  abstract,
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
  | typeof monad.id
  | typeof blast.id
  | typeof linea.id
  | typeof scroll.id
  | typeof mantle.id
  | typeof plasma.id
  | typeof mainnet.id
  | typeof polygon.id
  | typeof arbitrum.id
  | typeof unichain.id
  | typeof optimism.id
  | typeof avalanche.id
  | typeof berachain.id
  | typeof worldchain.id
  | typeof abstract.id;

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
  amountRaw: bigint;
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
