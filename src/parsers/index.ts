import {
  getAddress,
  formatUnits,
  decodeEventLog,
  decodeFunctionData,
} from "viem";
import {
  CONTRACTS,
  NATIVE_ASSET,
  EVENT_SIGNATURES,
  NATIVE_SYMBOL_BY_CHAIN_ID,
  EXCHANGE_PROXY_BY_CHAIN_ID,
} from "../constants";
import { minimalERC20Abi } from "../abi/MinimalERC20";
import { transferLogs, extractTokenInfo, isChainIdSupported } from "../utils";
import { exchangeProxyAbi as exchangeProxyAbiValue } from "../abi/ExchangeProxyAbi";
import type {
  Hex,
  Chain,
  Transport,
  Transaction,
  PublicClient,
  TransactionReceipt,
} from "viem";
import type {
  Parsers,
  TokenTransaction,
  SupportedChainId,
  FillLimitOrder,
  FillOtcOrderForEth,
  TransformERC20Args,
  FillOtcOrderWithEth,
  ExecuteMetaTransaction,
  FillTakerSignedOtcOrder,
  ExecuteMetaTransactionV2,
  MultiplexBatchSellTokenForEth,
  MultiplexBatchSellEthForToken,
  MultiplexBatchSellTokenForToken,
} from "../types";

export async function sellToLiquidityProvider({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const from = getAddress(transactionReceipt.from);
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => from === log.to);
  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function multiplexMultiHopSellTokenForEth({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const from = getAddress(transactionReceipt.from);
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => log.address === CONTRACTS.weth);

  if (inputLog && outputLog) {
    outputLog.symbol = NATIVE_ASSET.symbol;
    outputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function multiplexMultiHopSellEthForToken({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const from = getAddress(transactionReceipt.from);
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const inputLog = logs.find((log) => log.address === CONTRACTS.weth);
  const outputLog = logs.find((log) => log.to === from);

  if (inputLog && outputLog) {
    inputLog.symbol = NATIVE_ASSET.symbol;
    inputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function fillTakerSignedOtcOrder({
  callData,
  publicClient,
  exchangeProxyAbi,
  transactionReceipt,
}: {
  callData: Hex;
  publicClient: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  transactionReceipt: TransactionReceipt;
}) {
  const { args } = decodeFunctionData<FillTakerSignedOtcOrder[]>({
    abi: exchangeProxyAbi as unknown as FillTakerSignedOtcOrder[],
    data: callData,
  });
  const [order] = args;
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const { maker, taker } = order;
  const inputLog = logs.find((log) => log.from === taker);
  const outputLog = logs.find((log) => log.from === maker);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function fillOtcOrder({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const fromAddress = getAddress(transactionReceipt.from);
  const inputLog = logs.find((log) => log.from === fromAddress);
  const outputLog = logs.find((log) => log.to === fromAddress);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function fillTakerSignedOtcOrderForEth({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const inputLog = logs.find((log) => log.address !== CONTRACTS.weth);
  const outputLog = logs.find((log) => log.address === CONTRACTS.weth);

  if (inputLog && outputLog) {
    outputLog.symbol = NATIVE_ASSET.symbol;
    outputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function sellTokenForEthToUniswapV3({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const from = getAddress(transactionReceipt.from);
  const inputLog = logs.find((log) => log.from === from);
  const outputLog = logs.find((log) => log.from !== from);

  if (inputLog && outputLog) {
    outputLog.symbol = NATIVE_ASSET.symbol;
    outputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function sellTokenForTokenToUniswapV3({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const from = getAddress(transactionReceipt.from);
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => from === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function sellEthForTokenToUniswapV3({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const from = getAddress(transactionReceipt.from);
  const inputLog = logs.find((log) => from !== log.to);
  const outputLog = logs.find((log) => from === log.to);

  if (inputLog && outputLog) {
    inputLog.symbol = NATIVE_ASSET.symbol;
    inputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function sellToUniswap({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const inputLog = logs[0];
  const outputLog = logs[logs.length - 1];

  return extractTokenInfo(inputLog, outputLog);
}

export async function transformERC20({
  chainId,
  publicClient,
  transactionReceipt,
  exchangeProxyAbi,
}: {
  chainId?: SupportedChainId;
  publicClient: PublicClient;
  transactionReceipt: TransactionReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
}) {
  const nativeSymbol = chainId ? NATIVE_SYMBOL_BY_CHAIN_ID[chainId] : "";

  for (const log of transactionReceipt.logs) {
    const { topics, data } = log;
    const [eventHash] = topics;

    if (eventHash === EVENT_SIGNATURES.TransformedERC20) {
      let inputSymbol: undefined | string;
      let inputDecimal: undefined | number;
      let outputSymbol: undefined | string;
      let outputDecimal: undefined | number;

      const eventLog = decodeEventLog({
        data,
        topics,
        abi: exchangeProxyAbi,
      });

      const { inputToken, outputToken, inputTokenAmount, outputTokenAmount } =
        eventLog.args as TransformERC20Args;

      const inputContract = {
        address: inputToken,
        abi: minimalERC20Abi,
      } as const;

      const outputContract = {
        address: outputToken,
        abi: minimalERC20Abi,
      } as const;

      if (inputToken === NATIVE_ASSET.address) {
        inputSymbol = nativeSymbol;
        inputDecimal = 18;
      } else {
        [{ result: inputSymbol }, { result: inputDecimal }] =
          await publicClient.multicall({
            contracts: [
              {
                ...inputContract,
                functionName: "symbol",
              },
              {
                ...inputContract,
                functionName: "decimals",
              },
            ],
          });
      }

      if (outputToken === NATIVE_ASSET.address) {
        outputSymbol = nativeSymbol;
        outputDecimal = 18;
      } else {
        [{ result: outputSymbol }, { result: outputDecimal }] =
          await publicClient.multicall({
            contracts: [
              {
                ...outputContract,
                functionName: "symbol",
              },
              {
                ...outputContract,
                functionName: "decimals",
              },
            ],
          });
      }

      // 0x-parser expects decimals to be present. If you find a transaction where this is not the case, please open an issue.
      const inputAmount = formatUnits(inputTokenAmount, inputDecimal!);
      const outputAmount = formatUnits(outputTokenAmount, outputDecimal!);

      return {
        tokenIn: {
          address: inputToken,
          amount: inputAmount,
          symbol: inputSymbol,
        },
        tokenOut: {
          address: outputToken,
          amount: outputAmount,
          symbol: outputSymbol,
        },
      };
    }
  }
}

export async function multiplexMultiHopSellTokenForToken({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const from = getAddress(transactionReceipt.from);
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => from === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function multiplexBatchSellTokenForEth({
  callData,
  publicClient,
  exchangeProxyAbi,
  transactionReceipt,
}: {
  callData: Hex;
  publicClient: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const { args } = decodeFunctionData<MultiplexBatchSellTokenForEth[]>({
    abi: exchangeProxyAbi as unknown as MultiplexBatchSellTokenForEth[],
    data: callData,
  });
  const [inputTokenAddress] = args;

  return logs.reduce(
    (acc, curr) => {
      const { symbol, amount, address } = curr;

      if (address === CONTRACTS.weth) {
        return {
          ...acc,
          tokenOut: {
            ...acc.tokenOut,
            amount: (Number(acc.tokenOut.amount) + Number(amount)).toString(),
          },
        };
      } else if (address === inputTokenAddress) {
        return {
          ...acc,
          tokenIn: {
            ...acc.tokenIn,
            symbol,
            address,
            amount: (Number(acc.tokenIn.amount) + Number(amount)).toString(),
          },
        };
      } else {
        return acc;
      }
    },
    {
      tokenIn: { address: "", amount: "", symbol: "" },
      tokenOut: {
        amount: "",
        symbol: NATIVE_ASSET.symbol,
        address: NATIVE_ASSET.address,
      },
    }
  );
}

export async function multiplexBatchSellEthForToken({
  publicClient,
  transactionReceipt,
  transaction,
  exchangeProxyAbi,
  callData,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
  transaction: Transaction;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  callData: Hex;
}) {
  const { value } = transaction;
  const { args } = decodeFunctionData<MultiplexBatchSellEthForToken[]>({
    abi: exchangeProxyAbi as unknown as MultiplexBatchSellEthForToken[],
    data: callData,
  });
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const [outputToken] = args;
  const divisor = 1000000000000000000n; // 1e18, for conversion from wei to ether
  const etherBigInt = value / divisor;
  const remainderBigInt = value % divisor;
  const ether = Number(etherBigInt) + Number(remainderBigInt) / Number(divisor);
  const tokenOutAmount = logs.reduce((total, log) => {
    return log.address === outputToken ? total + Number(log.amount) : total;
  }, 0);
  const inputLog = logs.find((log) => log.address === CONTRACTS.weth);
  const outputLog = logs.find((log) => log.address === outputToken);

  if (inputLog && outputLog) {
    return {
      tokenIn: {
        symbol: NATIVE_ASSET.symbol,
        amount: ether.toString(),
        address: NATIVE_ASSET.address,
      },
      tokenOut: {
        symbol: outputLog.symbol,
        amount: tokenOutAmount.toString(),
        address: outputLog.address,
      },
    };
  }
}

export async function multiplexBatchSellTokenForToken({
  callData,
  exchangeProxyAbi,
  publicClient,
  transactionReceipt,
}: {
  callData: Hex;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });

  const { args } = decodeFunctionData<MultiplexBatchSellTokenForToken[]>({
    abi: exchangeProxyAbi as unknown as MultiplexBatchSellTokenForToken[],
    data: callData,
  });

  const [inputContractAddress, outputContractAddress] = args;

  const tokenData = {
    [inputContractAddress]: { amount: "0", symbol: "", address: "" },
    [outputContractAddress]: { amount: "0", symbol: "", address: "" },
  };

  logs.forEach(({ address, symbol, amount }) => {
    if (getAddress(address) in tokenData) {
      tokenData[getAddress(address)].address = getAddress(address);
      tokenData[getAddress(address)].symbol = symbol;
      tokenData[getAddress(address)].amount = (
        Number(tokenData[getAddress(address)].amount) + Number(amount)
      ).toString();
    }
  });

  return {
    tokenIn: tokenData[inputContractAddress],
    tokenOut: tokenData[outputContractAddress],
  };
}

export async function sellToPancakeSwap({
  publicClient,
  transactionReceipt,
}: {
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const exchangeProxy = getAddress(EXCHANGE_PROXY_BY_CHAIN_ID[56]);
  const from = getAddress(transactionReceipt.from);
  let inputLog = logs.find((log) => log.from === from);
  let outputLog = logs.find((log) => log.from !== from);

  if (inputLog === undefined) {
    inputLog = logs.find((log) => log.from === exchangeProxy);
    outputLog = logs.find((log) => log.from !== exchangeProxy);
  }

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function executeMetaTransaction({
  callData,
  exchangeProxyAbi,
  publicClient,
  transactionReceipt,
}: {
  callData: Hex;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const { args } = decodeFunctionData<ExecuteMetaTransaction[]>({
    abi: exchangeProxyAbi as unknown as ExecuteMetaTransaction[],
    data: callData,
  });
  const [metaTransaction] = args;
  const { signer } = metaTransaction;
  const logs = await transferLogs({ publicClient, transactionReceipt });
  if (typeof signer === "string") {
    const inputLog = logs.find((log) => log.from === signer);
    const outputLog = logs.find((log) => log.to === signer);
    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}

export async function fillOtcOrderForEth({
  callData,
  exchangeProxyAbi,
  publicClient,
  transactionReceipt,
}: {
  callData: Hex;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const { args } = decodeFunctionData<FillOtcOrderForEth[]>({
    abi: exchangeProxyAbi as unknown as FillOtcOrderForEth[],
    data: callData,
  });
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const [order] = args;
  const { makerToken, takerToken } = order;
  const inputLog = logs.find((log) => log.address === takerToken);
  const outputLog = logs.find((log) => log.address === makerToken);

  if (inputLog && outputLog) {
    outputLog.symbol = NATIVE_ASSET.symbol;
    outputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function fillOtcOrderWithEth({
  callData,
  exchangeProxyAbi,
  publicClient,
  transactionReceipt,
}: {
  callData: Hex;
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
  publicClient: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
}) {
  const { args } = decodeFunctionData<FillOtcOrderWithEth[]>({
    abi: exchangeProxyAbi as unknown as FillOtcOrderWithEth[],
    data: callData,
  });
  const logs = await transferLogs({ publicClient, transactionReceipt });
  const [order] = args;
  const { makerToken, takerToken } = order;
  const inputLog = logs.find((log) => log.address === takerToken);
  const outputLog = logs.find((log) => log.address === makerToken);

  if (inputLog && outputLog) {
    inputLog.symbol = NATIVE_ASSET.symbol;
    inputLog.address = NATIVE_ASSET.address;
    return extractTokenInfo(inputLog, outputLog);
  }
}

export async function fillLimitOrder({
  callData,
  exchangeProxyAbi,
  publicClient,
  transactionReceipt,
}: {
  callData: Hex;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  publicClient: PublicClient<Transport, Chain>;
  transactionReceipt: TransactionReceipt;
}) {
  const { args } = decodeFunctionData<FillLimitOrder[]>({
    abi: exchangeProxyAbi as unknown as FillLimitOrder[],
    data: callData,
  });
  const [order] = args;
  const { maker, taker } = order;
  const logs = await transferLogs({ publicClient, transactionReceipt });
  if (typeof maker === "string" && typeof taker === "string") {
    const inputLog = logs.find((log) => log.from === taker);
    const outputLog = logs.find((log) => log.from === maker);
    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}

async function executeMetaTransactionV2({
  chainId,
  transaction,
  publicClient,
  exchangeProxyAbi,
  transactionReceipt,
  callData: callDataMtx,
}: {
  chainId?: SupportedChainId;
  transaction: Transaction;
  publicClient: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  transactionReceipt: TransactionReceipt;
  callData: Hex;
}): Promise<TokenTransaction> {
  const { args } = decodeFunctionData<ExecuteMetaTransactionV2[]>({
    abi: exchangeProxyAbi as unknown as ExecuteMetaTransactionV2[],
    data: callDataMtx,
  });
  const [metaTransaction] = args;
  const { callData } = metaTransaction;
  const { functionName } = decodeFunctionData({
    data: callData,
    abi: exchangeProxyAbi,
  });

  return isChainIdSupported(chainId) && functionName === "transformERC20"
    ? transformERC20({
        chainId,
        publicClient,
        exchangeProxyAbi,
        transactionReceipt,
      })
    : parsers[functionName]({
        callData,
        transaction,
        publicClient,
        exchangeProxyAbi,
        transactionReceipt,
      });
}

export const parsers: Parsers = {
  fillLimitOrder,
  fillOtcOrder,
  fillOtcOrderForEth,
  fillOtcOrderWithEth,
  fillTakerSignedOtcOrder,
  fillTakerSignedOtcOrderForEth,
  executeMetaTransaction,
  executeMetaTransactionV2,
  multiplexBatchSellTokenForToken,
  multiplexBatchSellTokenForEth,
  multiplexBatchSellEthForToken,
  multiplexMultiHopSellTokenForToken,
  multiplexMultiHopSellEthForToken,
  multiplexMultiHopSellTokenForEth,
  sellToUniswap,
  sellTokenForEthToUniswapV3,
  sellEthForTokenToUniswapV3,
  sellTokenForTokenToUniswapV3,
  sellToLiquidityProvider,
  sellToPancakeSwap,
  transformERC20,
};
