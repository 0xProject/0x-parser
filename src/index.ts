import {
  parseUnits,
  formatUnits,
  formatEther,
  multicall3Abi,
  decodeFunctionData,
} from "viem";
import {
  SETTLER_ABI,
  MULTICALL3_ADDRESS,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_SYMBOL_BY_CHAIN_ID,
  SETTLER_META_TXN_BY_CHAIN_ID,
} from "./constants";
import {
  transferLogs,
  isChainIdSupported,
  extractNativeTransfer,
} from "./utils";
import type { Hash, Chain, Address, Transport, PublicClient } from "viem";
import type { TraceTransactionSchema } from "./types";

export async function parseSwap({
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

  const fromTaker = logs.filter(
    (log) => log.from.toLowerCase() === taker.toLowerCase()
  );

  let input = fromTaker.length ? fromTaker[0] : logs[0];

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
      abi: SETTLER_ABI,
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

  const isSettlerMetaTxn =
    to?.toLowerCase() === SETTLER_META_TXN_BY_CHAIN_ID[chainId].toLowerCase();

  if (isSettlerMetaTxn) {
    const { args } = decodeFunctionData<any[]>({
      abi: SETTLER_ABI,
      data: transaction.input,
    });

    const { 3: msgSender } = args;

    const nativeTransferAmount = extractNativeTransfer(trace, msgSender);

    if (nativeTransferAmount === "0") {
      output = logs[logs.length - 1];
      const takerReceived = logs.filter(
        (log) => log.to.toLowerCase() === msgSender.toLowerCase()
      );
      if (takerReceived.length === 1) {
        output = {
          symbol: takerReceived[0].symbol,
          amount: takerReceived[0].amount,
          address: takerReceived[0].address,
        };
      } /* v8 ignore start */ else {
        // Unknown if this case actually happens. If it does, please file a bug report here: https://github.com/0xProject/0x-parser/issues/new/choose".
        output = { symbol: "", amount: "", address: "" };
        console.error(
          "File a bug report here, including the expected results (URL to a block explorer) and the unexpected results: https://github.com/0xProject/0x-parser/issues/new/choose."
        );
      }
      /* v8 ignore stop */
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

  if (!output && input.from) {
    output = logs.find(
      (log) => log.to.toLowerCase() === input.from.toLowerCase()
    );
  }

  /* v8 ignore start */
  if (!output) {
    console.error(
      "File a bug report here, including the expected results (URL to a block explorer) and the unexpected results: https://github.com/0xProject/0x-parser/issues/new/choose."
    );
    return null;
  }
  /* v8 ignore stop */

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
