import {
  fromHex,
  erc20Abi,
  parseUnits,
  getAddress,
  formatUnits,
  formatEther,
  multicall3Abi,
  decodeFunctionData,
} from "viem";

import type {
  Hex,
  Hash,
  Chain,
  Address,
  Transport,
  PublicClient,
  TransactionReceipt,
} from "viem";

const settlerAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          {
            internalType: "contract IERC20",
            name: "buyToken",
            type: "address",
          },
          { internalType: "uint256", name: "minAmountOut", type: "uint256" },
        ],
        internalType: "struct SettlerBase.AllowedSlippage",
        name: "slippage",
        type: "tuple",
      },
      { internalType: "bytes[]", name: "actions", type: "bytes[]" },
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "msgSender", type: "address" },
      { internalType: "bytes", name: "sig", type: "bytes" },
    ],
    name: "executeMetaTxn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

type SupportedChainId = 1 | 10 | 56 | 137 | 8453 | 42161 | 43114;

export const NATIVE_SYMBOL_BY_CHAIN_ID: { [key in SupportedChainId]: string } =
  {
    1: "ETH", // Ethereum
    10: "ETH", // Optimism
    56: "BNB", // BNB Chain
    137: "MATIC", // Polygon
    8453: "ETH", // Base
    42161: "ETH", // Arbitrum One
    43114: "AVAX", // Avalanche
  };

const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

export function isChainIdSupported(
  chainId: number
): chainId is SupportedChainId {
  return [1, 10, 56, 137, 8453, 42161, 43114].includes(chainId);
}

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

interface Trace {
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

type TraceTransactionSchema = {
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

function extractNativeTransfer(trace: Trace, recipient: Address) {
  let totalTransferred = 0n;

  function traverseCalls(calls: Trace[]) {
    calls.forEach((call) => {
      if (
        call.to.toLowerCase() === recipient &&
        fromHex(call.value, "bigint") > 0n
      ) {
        totalTransferred = totalTransferred + fromHex(call.value, "bigint");
      }
      if (call.calls && call.calls.length > 0) {
        traverseCalls(call.calls);
      }
    });
  }

  traverseCalls(trace.calls);

  return formatEther(totalTransferred);
}

export async function transferLogs({
  publicClient,
  transactionReceipt,
}: EnrichLogsArgs): Promise<
  {
    to: `0x${string}`;
    from: `0x${string}`;
    symbol: string;
    amount: string;
    address: `0x${string}`;
    decimals: number;
  }[]
> {
  const EVENT_SIGNATURES = {
    Transfer:
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  } as const;
  const { logs } = transactionReceipt;
  const transferLogsAddresses = logs
    .filter((log) => log.topics[0] === EVENT_SIGNATURES.Transfer)
    .map((log) => ({ ...log, address: getAddress(log.address) }));
  const contracts = [
    ...transferLogsAddresses.map((log) => ({
      abi: erc20Abi,
      address: log.address,
      functionName: "symbol",
    })),
    ...transferLogsAddresses.map((log) => ({
      abi: erc20Abi,
      address: log.address,
      functionName: "decimals",
    })),
  ];
  const results = await publicClient.multicall({ contracts });
  const midpoint = Math.floor(results.length / 2);
  const enrichedLogs = transferLogsAddresses
    .map((log, index) => {
      const symbol = results[index].result as string;
      const decimals = results[midpoint + index].result as number;
      const amount =
        log.data === "0x" ? "0" : formatUnits(BigInt(log.data), decimals);
      const { address, topics } = log;
      const { 1: fromHex, 2: toHex } = topics;
      const from = getAddress(convertHexToAddress(fromHex));
      const to = getAddress(convertHexToAddress(toHex));

      return { to, from, symbol, amount, address, decimals };
    })
    .filter((log) => log.amount !== "0");

  return enrichedLogs;
}

function convertHexToAddress(hexString: string): string {
  return `0x${hexString.slice(-40)}`;
}

export async function parseSwapV2({
  publicClient,
  transactionHash: hash,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionHash: Address;
}) {
  const chainId = await publicClient.getChainId();

  if (!isChainIdSupported(chainId)) {
    throw new Error(`chainId ${chainId} is unsupported…`);
  }

  const client = publicClient.extend((client) => ({
    async traceCall(args: { hash: Hash }) {
      return client.request<TraceTransactionSchema>({
        method: "debug_traceTransaction",
        params: [args.hash, { tracer: "callTracer" }],
      });
    },
  }));

  const trace = await client.traceCall({ hash });

  const transaction = await publicClient.getTransaction({ hash });

  const { from: taker, value, to } = transaction;

  const nativeTransferAmount = extractNativeTransfer(trace, taker);

  const transactionReceipt = await publicClient.getTransactionReceipt({ hash });

  const isNativeSell = value > 0n;

  const logs = await transferLogs({
    publicClient,
    transactionReceipt,
  });

  let input = logs[0];

  let output =
    nativeTransferAmount === "0"
      ? logs.find((log) => {
          return log.to.toLowerCase() === taker.toLowerCase();
        })
      : {
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
          amount: nativeTransferAmount,
          address: NATIVE_TOKEN_ADDRESS,
        };

  if (to?.toLowerCase() === MULTICALL3_ADDRESS.toLowerCase()) {
    const { args: multicallArgs } = decodeFunctionData({
      abi: multicall3Abi,
      data: transaction.input,
    });

    const { args: settlerArgs } = decodeFunctionData<any[]>({
      abi: settlerAbi,
      data: multicallArgs[0][1].callData,
    });

    const takerForGaslessApprovalSwap =
      settlerArgs[0].recipient.toLowerCase() as Address;

    const nativeTransferAmount = extractNativeTransfer(
      trace,
      takerForGaslessApprovalSwap
    );

    if (nativeTransferAmount === "0") {
      output = output = logs[logs.length - 1];
    } else {
      output = {
        symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        amount: nativeTransferAmount,
        address: NATIVE_TOKEN_ADDRESS,
      };
    }
  }

  if (isNativeSell) {
    const nativeSellAmount = formatEther(value);
    const tokenOut = logs
      .filter((log) => log.to.toLowerCase() === taker)
      .reduce(
        (acc, curr) => ({
          symbol: curr.symbol,
          amount: formatUnits(
            BigInt(acc.amount) + parseUnits(curr.amount, curr.decimals),
            curr.decimals
          ),
          address: curr.address,
        }),
        { symbol: "", amount: "", address: "" }
      );

    return {
      tokenIn: {
        symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        address: NATIVE_TOKEN_ADDRESS,
        amount: nativeSellAmount,
      },
      tokenOut,
    };
  }

  if (!output) {
    return null;
  }

  return {
    tokenIn: {
      symbol: input.symbol,
      amount: input.amount,
      address: input.address,
    },
    tokenOut: {
      symbol: output.symbol,
      amount: output.amount,
      address: output.address,
    },
  };
}
