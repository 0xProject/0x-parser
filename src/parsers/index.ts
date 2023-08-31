import {
  getAddress,
  formatUnits,
  decodeEventLog,
  decodeFunctionData,
} from "viem";
import {
  extractTokenInfo,
  isChainIdSupported,
  enrichTransactionReceipt,
} from "../utils";
import { minimalERC20Abi } from "../abi/MinimalERC20";
import {
  CONTRACTS,
  NATIVE_ASSET,
  EVENT_SIGNATURES,
  NATIVE_SYMBOL_BY_CHAIN_ID,
  EXCHANGE_PROXY_BY_CHAIN_ID,
} from "../constants";
import type {
  Hex,
  Chain,
  Transport,
  Transaction,
  PublicClient,
  TransactionReceipt,
} from "viem";
import type {
  LogParsers,
  TokenTransaction,
  SupportedChainId,
  EnrichedTxReceipt,
  TransformERC20Args,
  FillLimitOrderArgs,
  MetaTransactionArgs,
  FillOtcOrderForEthArgs,
  ExecuteMetaTransactionArgs,
  FillTakerSignedOtcOrderArgs,
  MultiplexBatchSellEthForTokenArgs,
  MultiplexBatchSellTokenForEthArgs,
  MultiplexBatchSellTokenForTokenArgs,
} from "../types";
import { exchangeProxyAbi as exchangeProxyAbiValue } from "../abi/ExchangeProxyAbi";

export function sellToLiquidityProvider({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => from === log.to);
  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function multiplexMultiHopSellTokenForEth({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => log.address === CONTRACTS.weth);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function multiplexMultiHopSellEthForToken({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => log.address === CONTRACTS.weth);
  const outputLog = logs.find((log) => log.to === from);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function fillTakerSignedOtcOrder({
  txReceipt,
  exchangeProxyAbi,
  callData,
}: {
  txReceipt: EnrichedTxReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  callData: Hex;
}) {
  const { args } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });
  const [order] = args as FillTakerSignedOtcOrderArgs;
  const { logs } = txReceipt;
  const { maker, taker } = order;
  const inputLog = logs.find((log) => log.from === taker);
  const outputLog = logs.find((log) => log.from === maker);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function fillOtcOrder({ txReceipt }: { txReceipt: EnrichedTxReceipt }) {
  const { logs, from } = txReceipt;
  const fromAddress = from;
  const inputLog = logs.find((log) => log.from === fromAddress);
  const outputLog = logs.find((log) => log.to === fromAddress);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function fillTakerSignedOtcOrderForEth({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs } = txReceipt;
  const inputLog = logs.find((log) => log.address !== CONTRACTS.weth);
  const outputLog = logs.find((log) => log.address === CONTRACTS.weth);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function sellTokenForEthToUniswapV3({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => log.from === from);
  const outputLog = logs.find((log) => log.from !== from);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function sellTokenForTokenToUniswapV3({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => from === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function sellEthForTokenToUniswapV3({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => from !== log.to);
  const outputLog = logs.find((log) => from === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function sellToUniswap({ txReceipt }: { txReceipt: EnrichedTxReceipt }) {
  const { logs } = txReceipt;
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

      if (inputToken === NATIVE_ASSET) {
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

      if (outputToken === NATIVE_ASSET) {
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

export function multiplexMultiHopSellTokenForToken({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => from === log.from);
  const outputLog = logs.find((log) => from === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function multiplexBatchSellTokenForEth({
  txReceipt,
  exchangeProxyAbi,
  callData,
}: {
  txReceipt: EnrichedTxReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  callData: Hex;
}) {
  const { logs } = txReceipt;
  const { args } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });
  const [inputTokenAddress] = args as MultiplexBatchSellTokenForEthArgs;

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
      tokenOut: { amount: "", symbol: "ETH", address: NATIVE_ASSET },
    }
  );
}

export function multiplexBatchSellEthForToken({
  txReceipt,
  transaction,
  exchangeProxyAbi,
  callData,
}: {
  txReceipt: EnrichedTxReceipt;
  transaction: Transaction;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  callData: Hex;
}) {
  const { value } = transaction;
  const { args } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });
  const { logs } = txReceipt;
  const { 0: outputToken } = args as MultiplexBatchSellEthForTokenArgs;
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
        symbol: inputLog.symbol,
        amount: ether.toString(),
        address: inputLog.address,
      },
      tokenOut: {
        symbol: outputLog.symbol,
        amount: tokenOutAmount.toString(),
        address: outputLog.address,
      },
    };
  }
}

export function multiplexBatchSellTokenForToken({
  callData,
  txReceipt,
  exchangeProxyAbi,
}: {
  callData: Hex;
  txReceipt: EnrichedTxReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
}) {
  const { args: MultiplexBatchSellTokenForTokenArgs } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });

  const [inputContractAddress, outputContractAddress] =
    MultiplexBatchSellTokenForTokenArgs as MultiplexBatchSellTokenForTokenArgs;

  const tokenData = {
    [inputContractAddress]: { amount: "0", symbol: "", address: "" },
    [outputContractAddress]: { amount: "0", symbol: "", address: "" },
  };

  txReceipt.logs.forEach(({ address, symbol, amount }) => {
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

export function sellToPancakeSwap({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const from = txReceipt.from;
  const { logs } = txReceipt;
  const exchangeProxy = getAddress(EXCHANGE_PROXY_BY_CHAIN_ID[56]);
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

export function executeMetaTransaction({
  callData,
  txReceipt,
  exchangeProxyAbi,
}: {
  callData: Hex;
  txReceipt: EnrichedTxReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
}) {
  const { args } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });
  const [metaTransaction] = args as ExecuteMetaTransactionArgs;
  const { signer } = metaTransaction;
  const { logs } = txReceipt;
  if (typeof signer === "string") {
    const inputLog = logs.find((log) => log.from === signer);
    const outputLog = logs.find((log) => log.to === signer);
    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}

export function fillOtcOrderForEth({
  callData,
  txReceipt,
  exchangeProxyAbi,
}: {
  callData: Hex;
  txReceipt: EnrichedTxReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
}) {
  const { args } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });
  const { logs } = txReceipt;
  const [order] = args as FillOtcOrderForEthArgs;
  const { makerToken, takerToken } = order;
  const inputLog = logs.find((log) => log.address === takerToken);
  const outputLog = logs.find((log) => log.address === makerToken);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function fillOtcOrderWithEth(args: {
  txReceipt: EnrichedTxReceipt;
  transaction: Transaction;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  callData: Hex;
}) {
  return fillOtcOrderForEth(args);
}

export function fillLimitOrder({
  callData,
  txReceipt,
  exchangeProxyAbi,
}: {
  callData: Hex;
  txReceipt: EnrichedTxReceipt;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
}) {
  const { args } = decodeFunctionData({
    abi: exchangeProxyAbi,
    data: callData,
  });
  const [order] = args as FillLimitOrderArgs;
  const { maker, taker } = order;
  const { logs } = txReceipt;
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
  publicClient: PublicClient<Transport, Chain>;
  exchangeProxyAbi: typeof exchangeProxyAbiValue;
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
  callData: Hex;
}): Promise<TokenTransaction | undefined> {
  const { args } = decodeFunctionData({
    data: callDataMtx,
    abi: exchangeProxyAbi,
  });
  const [mtx] = args as unknown as MetaTransactionArgs;
  const { signer, callData, fees } = mtx;
  const { recipient } = fees[0];

  const { functionName } = decodeFunctionData({
    data: callData,
    abi: exchangeProxyAbi,
  });

  if (isChainIdSupported(chainId) && functionName === "transformERC20") {
    return transformERC20({
      chainId,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
    });
  } else {
    const parser = logParsers[functionName];
    const { logs } = await enrichTransactionReceipt({
      publicClient,
      transactionReceipt,
    });
    const filteredLogs = logs.filter(
      (log) => log.to !== recipient.toLowerCase()
    );

    return parser({
      callData,
      transaction,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
      txReceipt: { from: signer, logs: filteredLogs },
    });
  }
}

export const logParsers: LogParsers = {
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
