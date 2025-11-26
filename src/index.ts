import {
  parseUnits,
  formatUnits,
  formatEther,
  multicall3Abi,
  decodeFunctionData,
} from "viem";
import {
  SUPPORTED_CHAINS,
  MULTICALL3_ADDRESS,
  FUNCTION_SELECTORS,
  ERC_4337_ENTRY_POINT,
  NATIVE_TOKEN_ADDRESS,
  SETTLER_META_TXN_ABI,
  NATIVE_SYMBOL_BY_CHAIN_ID,
} from "./constants";
import {
  transferLogs,
  isChainIdSupported,
  calculateNativeTransfer,
  parseSmartContractWalletTx,
} from "./utils";
import type { Hash, Chain, Address, Transport, PublicClient } from "viem";
import type { TraceTransactionSchema } from "./types";

export async function parseSwap({
  publicClient,
  transactionHash: hash,
  smartContractWallet,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionHash: Address;
  smartContractWallet?: Address;
}) {
  const chainId = publicClient.chain.id;

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

  const [trace, transaction, transactionReceipt] = await Promise.all([
    client.traceCall({ hash }),
    publicClient.getTransaction({ hash }),
    publicClient.getTransactionReceipt({ hash }),
  ]);

  const { from: taker, value, to } = transaction;

  const isToERC4337 = to === ERC_4337_ENTRY_POINT.toLowerCase();

  const nativeAmountToTaker = calculateNativeTransfer(trace, {
    recipient: taker,
  });

  if (transactionReceipt.status === "reverted") {
    const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
    const message = `Unable to parse. Transaction ${hash} on ${chain?.name} has reverted.`;
    console.warn(message);
    return null;
  }

  const isNativeSell = value > 0n;

  const logs = await transferLogs({
    publicClient,
    transactionReceipt,
  });

  if (isToERC4337) {
    if (!smartContractWallet) {
      throw new Error(
        "This is an ERC-4337 transaction. You must provide a smart contract wallet address to 0x-parser."
      );
    }

    return parseSmartContractWalletTx({
      logs,
      trace,
      chainId,
      smartContractWallet,
    });
  }

  const fromTaker = logs.filter(
    (log) => log.from.toLowerCase() === taker.toLowerCase()
  );

  let input = fromTaker.length
    ? fromTaker.reduce((acc, curr) => ({
        ...acc,
        amount: formatUnits(acc.amountRaw + curr.amountRaw, curr.decimals),
        amountRaw: acc.amountRaw + curr.amountRaw,
      }))
    : logs[0];

  let output =
    nativeAmountToTaker === "0"
      ? logs.find((log) => {
          return log.to.toLowerCase() === taker.toLowerCase();
        })
      : {
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
          amount: nativeAmountToTaker,
          address: NATIVE_TOKEN_ADDRESS,
        };

  if (to?.toLowerCase() === MULTICALL3_ADDRESS.toLowerCase()) {
    const { args: multicallArgs } = decodeFunctionData({
      abi: multicall3Abi,
      data: transaction.input,
    });

    if (multicallArgs[0]) {
      const { args: settlerArgs } = decodeFunctionData({
        abi: SETTLER_META_TXN_ABI,
        data: multicallArgs[0][1].callData,
      });

      const takerForGaslessApprovalSwap =
        settlerArgs[0].recipient.toLowerCase() as Address;

      const msgSender = settlerArgs[3];

      const nativeAmountToTaker = calculateNativeTransfer(trace, {
        recipient: takerForGaslessApprovalSwap,
      });

      if (nativeAmountToTaker === "0") {
        [output] = logs.filter(
          (log) => log.to.toLowerCase() === msgSender.toLowerCase()
        );
      } else {
        output = {
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
          amount: nativeAmountToTaker,
          address: NATIVE_TOKEN_ADDRESS,
        };
      }
    }
  }

  if (transaction.input.startsWith(FUNCTION_SELECTORS.EXECUTE_META_TXN)) {
    const { args } = decodeFunctionData({
      abi: SETTLER_META_TXN_ABI,
      data: transaction.input,
    });

    const { 3: msgSender } = args;

    const logsFromTaker = logs.filter((log) => log.from === msgSender);

    const nativeAmountToTaker = calculateNativeTransfer(trace, {
      recipient: msgSender,
    });

    if (logsFromTaker.length) {
      input = logsFromTaker[0];
    }

    if (nativeAmountToTaker === "0") {
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
        console.error(
          "File a bug report here, including the expected results (URL to a block explorer) and the unexpected results: https://github.com/0xProject/0x-parser/issues/new/choose."
        );
      }

      input = logs.filter(
        (log) => log.from.toLowerCase() === msgSender.toLowerCase()
      )[0];

      /* v8 ignore stop */
    } else {
      output = {
        symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        amount: nativeAmountToTaker,
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
  if (!logs.length) /* v8 ignore next */ return null;    
    const firstTransfer = logs[0];
    const lastTransfer = logs[logs.length - 1];
    return {
      tokenIn: {
        symbol: firstTransfer.symbol,
        address: firstTransfer.address.toLowerCase(),
        amount: firstTransfer.amount
      },
      tokenOut: {
        symbol: lastTransfer.symbol,
        address: lastTransfer.address.toLowerCase(),
        amount: lastTransfer.amount
      }
    };
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
