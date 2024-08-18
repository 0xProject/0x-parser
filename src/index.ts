import {
  parseUnits,
  formatUnits,
  formatEther,
  multicall3Abi,
  decodeFunctionData,
} from "viem";
import {
  ERC_4337_ABI,
  MULTICALL3_ADDRESS,
  FUNCTION_SELECTORS,
  NATIVE_TOKEN_ADDRESS,
  SETTLER_META_TXN_ABI,
  NATIVE_SYMBOL_BY_CHAIN_ID,
  SETTLER_ABI,
  coinbaseSmartWalletAbi,
} from "./constants";
import {
  transferLogs,
  isChainIdSupported,
  extractNativeTransfer,
  extractNativeTransfer2,
} from "./utils";
import type { Hash, Chain, Address, Transport, PublicClient } from "viem";
import type { TraceTransactionSchema } from "./types";

const settler_base = "0xf15c6EC20e5863351D3bBC9E742f9208E3A343fF";
const settler_meta_txn_base = "0x1d49EA51279185eF557f07215341c037e4988aAc";
const taker = "0x3F6dAB60Cc16377Df9684959e20962f44De20988";

export async function parseSwap({
  publicClient,
  transactionHash: hash,
  smartContractWalletAddress,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionHash: Address;
  smartContractWalletAddress?: Address;
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

  const ERC_4337_ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

  const trace = await client.traceCall({ hash });

  const transaction = await publicClient.getTransaction({ hash });

  const { from: taker, value, to } = transaction;

  const isToERC4337 = to === ERC_4337_ENTRY_POINT.toLowerCase();

  const nativeTransferAmount = extractNativeTransfer(trace, taker);

  const transactionReceipt = await publicClient.getTransactionReceipt({ hash });

  const isNativeSell = value > 0n;

  const logs = await transferLogs({
    publicClient,
    transactionReceipt,
  });

  if (isToERC4337) {
    const { args, functionName } = decodeFunctionData({
      abi: ERC_4337_ABI,
      data: transaction.input,
    });

    const arrayOfUserOperations = args;

    console.log(arrayOfUserOperations[0]);

    const data =
      "0x34fcd5be000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f15c6ec20e5863351d3bbc9e742f9208e3a343ff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000aa81fff991f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0eeb1697ff7debc77369aa58c1d49ab00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000066000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000000e48d68a156000000000000000000000000f15c6ec20e5863351d3bbc9e742f9208e3a343ff000000000000000000000000000000000000000000000000000000000000138800000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c4ed4e862860bed51a9570b96d89af5e1b0efefed010001f4420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e48d68a156000000000000000000000000f15c6ec20e5863351d3bbc9e742f9208e3a343ff000000000000000000000000000000000000000000000000000000000000119300000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c4ed4e862860bed51a9570b96d89af5e1b0efefed010009c44200000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022438c9c1470000000000000000000000004ed4e862860bed51a9570b96d89af5e1b0efefed0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000cf77a3ba9a5ca399b7c97c74d54e5b1beb874e43000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000144cac88ea900000000000000000000000000000000000000000000000d27a3684c3a8b8000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000f15c6ec20e5863351d3bbc9e742f9208e3a343ff0000000000000000000000000000000000000000000000000000000066c0294400000000000000000000000000000000000000000000000000000000000000010000000000000000000000004ed4e862860bed51a9570b96d89af5e1b0efefed00000000000000000000000042000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001000000000000000000000000420dd381b31aef6683db6b902084cb0ffece40da000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e48d68a1560000000000000000000000003f6dab60cc16377df9684959e20962f44de20988000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000029a4becda69f5be20000000000000000000000000000000000000000000000000000000000000002c420000000000000000000000000000000000000600000bb8532f27101965dd16442e59d40670faf5ebb142e4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffc1fb425e000000000000000000000000f15c6ec20e5863351d3bbc9e742f9208e3a343ff0000000000000000000000004ed4e862860bed51a9570b96d89af5e1b0efefed00000000000000000000000000000000000000000000002fd5f51e2c77cb2b2b0000000000000000000000000000000000006e898131631616b1779bad70bc140000000000000000000000000000000000000000000000000000000066c0294400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000012c25e651b347c854f30024ef30cade1acac2139cbbae93b973bdf851150bf78456415046648e73da80aebf2a86c66234526199dd14c90daace44b8e0d42f2d050000000000000000000000000000000000000000000000000000000000000025f198086b2db17256731bc456673b96bcef23f51d1fbacdd7c4379ef65465572f0100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a224550386f61334d414962734156695758425338506543357a6641394334334f5444764e47524b7a4b726745222c226f726967696e223a2268747470733a2f2f6b6579732e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

    const result = decodeFunctionData({
      abi: coinbaseSmartWalletAbi,
      data: data,
    });

    // console.log(args, "<--x");

    if (!smartContractWalletAddress) {
      throw new Error(
        "This is an ERC-4337 transaction. You must provide a smart contract wallet address to 0x-parser."
      );
    }

    const transfersFromSmartContractWallet = logs.reduce((acc, curr) => {
      if (curr.to === smartContractWalletAddress) {
        return {
          ...acc,
          output: curr,
        };
      }

      if (curr.from === smartContractWalletAddress) {
        return {
          ...acc,
          input: curr,
        };
      }

      return acc;
    }, {});

    let { input, output } = transfersFromSmartContractWallet as any;

    const nativeTransferAmount = extractNativeTransfer(
      trace,
      smartContractWalletAddress
    );

    const nativeTransferAmount2 = extractNativeTransfer2(
      trace,
      smartContractWalletAddress
    );

    if (!output && nativeTransferAmount !== "0") {
      return {
        tokenIn: {
          address: input.address,
          amount: input.amount,
          symbol: input.symbol,
        },
        tokenOut: {
          address: NATIVE_TOKEN_ADDRESS,
          amount: nativeTransferAmount,
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        },
      };
    } else if (!input && nativeTransferAmount2 !== "0") {
      const inputLog = logs.filter((log) => log.symbol === "WETH")[0];
      return {
        tokenIn: {
          address: NATIVE_TOKEN_ADDRESS,
          amount: inputLog?.amount,
          symbol: NATIVE_SYMBOL_BY_CHAIN_ID[chainId],
        },
        tokenOut: {
          address: output.address,
          amount: output.amount,
          symbol: output.symbol,
        },
      };
    } else {
      return {
        tokenIn: {
          address: input.address,
          amount: input.amount,
          symbol: input.symbol,
        },
        tokenOut: {
          address: output.address,
          amount: output.amount,
          symbol: output.symbol,
        },
      };
    }
  }

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

    const { args: settlerArgs } = decodeFunctionData({
      abi: SETTLER_META_TXN_ABI,
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

  if (transaction.input.startsWith(FUNCTION_SELECTORS.EXECUTE_META_TXN)) {
    const { args } = decodeFunctionData({
      abi: SETTLER_META_TXN_ABI,
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
