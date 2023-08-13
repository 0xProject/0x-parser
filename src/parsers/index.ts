import { formatUnits } from "ethers";
import { extractTokenInfo, fetchSymbolAndDecimal } from "../utils";
import {
  CONTRACTS,
  NATIVE_ASSET,
  EVENT_SIGNATURES,
  NATIVE_SYMBOL_BY_CHAIN_ID,
} from "../constants";
import type {
  Contract,
  TransactionReceipt,
  TransactionDescription,
} from "ethers";
import type {
  SupportedChainId,
  EnrichedTxReceipt,
  TryBlockAndAggregate,
  TransformERC20EventData,
} from "../types";

export function sellToLiquidityProvider({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { logs, from } = txReceipt;
  const inputLog = logs.find((log) => from.toLowerCase() === log.from);
  const outputLog = logs.find((log) => from.toLowerCase() === log.to);
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
  const inputLog = logs.find((log) => from.toLowerCase() === log.from);
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
  const outputLog = logs.find((log) => log.to === from.toLowerCase());

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function fillTakerSignedOtcOrder({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  const [order] = txDescription.args;
  const { logs } = txReceipt;
  const { 4: maker, 5: taker } = order as string[];
  if (typeof maker === "string" && typeof taker === "string") {
    const inputLog = logs.find((log) => log.from === taker.toLowerCase());
    const outputLog = logs.find((log) => log.from === maker.toLowerCase());

    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}

export function fillOtcOrder({ txReceipt }: { txReceipt: EnrichedTxReceipt }) {
  const { logs, from } = txReceipt;
  const fromAddress = from.toLowerCase();
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
  const inputLog = logs.find((log) => log.from === from.toLowerCase());
  const outputLog = logs.find((log) => log.from !== from.toLowerCase());

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
  const inputLog = logs.find((log) => from.toLowerCase() === log.from);
  const outputLog = logs.find((log) => from.toLowerCase() === log.to);

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
  const inputLog = logs.find((log) => from.toLowerCase() !== log.to);
  const outputLog = logs.find((log) => from.toLowerCase() === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function sellToUniswap({ txReceipt }: { txReceipt: EnrichedTxReceipt }) {
  const [inputLog, outputLog] = txReceipt.logs;

  return extractTokenInfo(inputLog, outputLog);
}

export async function transformERC20({
  chainId,
  contract,
  transactionReceipt,
  tryBlockAndAggregate,
}: {
  contract: Contract;
  chainId: SupportedChainId;
  transactionReceipt: TransactionReceipt;
  tryBlockAndAggregate: TryBlockAndAggregate;
}) {
  const nativeSymbol = NATIVE_SYMBOL_BY_CHAIN_ID[chainId];

  for (const log of transactionReceipt.logs) {
    const { topics, data } = log;
    const [eventHash] = topics;
    if (eventHash === EVENT_SIGNATURES.TransformedERC20) {
      const logDescription = contract.interface.parseLog({
        data,
        topics: [...topics],
      });
      const {
        1: inputToken,
        2: outputToken,
        3: inputTokenAmount,
        4: outputTokenAmount,
      } = logDescription!.args as unknown as TransformERC20EventData;

      let inputSymbol: string;
      let inputDecimal: number;
      let outputSymbol: string;
      let outputDecimal: number;

      if (inputToken === NATIVE_ASSET) {
        inputSymbol = nativeSymbol;
        inputDecimal = 18;
      } else {
        [inputSymbol, inputDecimal] = await fetchSymbolAndDecimal(
          inputToken,
          tryBlockAndAggregate
        );
      }

      if (outputToken === NATIVE_ASSET) {
        outputSymbol = nativeSymbol;
        outputDecimal = 18;
      } else {
        [outputSymbol, outputDecimal] = await fetchSymbolAndDecimal(
          outputToken,
          tryBlockAndAggregate
        );
      }

      const inputAmount = formatUnits(inputTokenAmount, inputDecimal);
      const outputAmount = formatUnits(outputTokenAmount, outputDecimal);

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
  const inputLog = logs.find((log) => from.toLowerCase() === log.from);
  const outputLog = logs.find((log) => from.toLowerCase() === log.to);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function multiplexBatchSellTokenForEth({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const { from, logs } = txReceipt;
  const tokenData = {
    [from.toLowerCase()]: { amount: "0", symbol: "", address: "" },
    [CONTRACTS.weth.toLowerCase()]: {
      amount: "0",
      symbol: "ETH",
      address: NATIVE_ASSET,
    },
  };

  logs.forEach(({ address, symbol, amount, from }) => {
    const erc20Address = address.toLowerCase();
    if (tokenData[erc20Address]) {
      tokenData[erc20Address].amount = String(
        Number(tokenData[erc20Address].amount) + Number(amount)
      );
    }
    if (tokenData[from]) {
      tokenData[from].amount = String(
        Number(tokenData[from].amount) + Number(amount)
      );
      tokenData[from].symbol = symbol;
      tokenData[from].address = address;
    }
  });

  return {
    tokenIn: tokenData[from.toLowerCase()],
    tokenOut: tokenData[CONTRACTS.weth.toLowerCase()],
  };
}

export function multiplexBatchSellEthForToken({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  const { logs } = txReceipt;
  const { args, value } = txDescription;
  const { 0: outputToken } = args;
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
  txDescription,
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  const [inputContractAddress, outputContractAddress] = txDescription.args;

  if (
    typeof inputContractAddress === "string" &&
    typeof outputContractAddress === "string"
  ) {
    const tokenData = {
      [inputContractAddress]: { amount: "0", symbol: "", address: "" },
      [outputContractAddress]: { amount: "0", symbol: "", address: "" },
    };

    txReceipt.logs.forEach(({ address, symbol, amount }) => {
      if (address in tokenData) {
        tokenData[address].address = address;
        tokenData[address].symbol = symbol;
        tokenData[address].amount = (
          Number(tokenData[address].amount) + Number(amount)
        ).toString();
      }
    });

    return {
      tokenIn: tokenData[inputContractAddress],
      tokenOut: tokenData[outputContractAddress],
    };
  }
}

export function sellToPancakeSwap({
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
}) {
  const from = txReceipt.from.toLowerCase();
  const { logs } = txReceipt;
  const exchangeProxy = CONTRACTS.exchangeProxyByChainId[56].toLowerCase();
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
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  const [metaTransaction] = txDescription.args;
  const [from] = metaTransaction as string[];
  const { logs } = txReceipt;
  if (typeof from === "string") {
    const inputLog = logs.find((log) => log.from === from.toLowerCase());
    const outputLog = logs.find((log) => log.to === from.toLowerCase());
    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}

export function fillOtcOrderForEth({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  const { logs } = txReceipt;
  const [order] = txDescription.args;
  const [makerToken, takerToken] = order as string[];
  const inputLog = logs.find((log) => log.address === takerToken);
  const outputLog = logs.find((log) => log.address === makerToken);

  if (inputLog && outputLog) {
    return extractTokenInfo(inputLog, outputLog);
  }
}

export function fillOtcOrderWithEth({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  return fillOtcOrderForEth({ txReceipt, txDescription });
}

export function fillLimitOrder({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TransactionDescription;
}) {
  const [order] = txDescription.args;
  const { 5: maker, 6: taker } = order as string[];
  const { logs } = txReceipt;
  if (typeof maker === "string" && typeof taker === "string") {
    const inputLog = logs.find((log) => log.from === taker.toLowerCase());
    const outputLog = logs.find((log) => log.from === maker.toLowerCase());
    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}
