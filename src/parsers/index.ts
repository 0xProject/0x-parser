import { WETH_CONTRACT_ADDRESS, ZERO_EX_EXCHANGE_PROXY } from "../constants";
import { extractTokenInfo } from "../utils";
import type { EnrichedTxReceipt, TxDescription } from "../types";

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
  const outputLog = logs.find((log) => log.address === WETH_CONTRACT_ADDRESS);

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
  const inputLog = logs.find((log) => log.address === WETH_CONTRACT_ADDRESS);
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
  txDescription: TxDescription;
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
  const inputLog = logs.find((log) => log.address !== WETH_CONTRACT_ADDRESS);
  const outputLog = logs.find((log) => log.address === WETH_CONTRACT_ADDRESS);

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

export function transformERC20({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TxDescription;
}) {
  const { logs } = txReceipt;
  const { value } = txDescription;

  let inputLog = logs.find((log) => log.from === txReceipt.from.toLowerCase()); // doesn't exist if user sends ETH
  const outputLog = logs.find((log) => log.to === txReceipt.from.toLowerCase());

  if (inputLog && outputLog) {
    return {
      tokenIn: { symbol: inputLog.symbol, amount: inputLog.amount },
      tokenOut: { symbol: outputLog.symbol, amount: outputLog.amount },
    };
  }

  if (txDescription.value && outputLog) {
    // Convert to ether
    const divisor = 1000000000000000000n; // 1e18, for conversion from wei to ether
    const etherBigInt = value / divisor;
    const remainderBigInt = value % divisor;
    const ether =
      Number(etherBigInt) + Number(remainderBigInt) / Number(divisor);

    return {
      tokenIn: { symbol: "ETH", amount: ether.toString() },
      tokenOut: { symbol: outputLog.symbol, amount: outputLog.amount },
    };
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
    [from.toLowerCase()]: { amount: "0", symbol: "" },
    [WETH_CONTRACT_ADDRESS.toLowerCase()]: { amount: "0", symbol: "" },
  };

  logs.forEach(({ address, symbol, amount, from }) => {
    const erc20Address = address.toLowerCase();
    if (tokenData[erc20Address]) {
      tokenData[erc20Address].amount = String(
        Number(tokenData[erc20Address].amount) + Number(amount)
      );
      tokenData[erc20Address].symbol = symbol;
    }
    if (tokenData[from]) {
      tokenData[from].amount = String(
        Number(tokenData[from].amount) + Number(amount)
      );
      tokenData[from].symbol = symbol;
    }
  });

  return {
    tokenIn: tokenData[from.toLowerCase()],
    tokenOut: tokenData[WETH_CONTRACT_ADDRESS.toLowerCase()],
  };
}

export function multiplexBatchSellEthForToken({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TxDescription;
}) {
  const { logs } = txReceipt;
  const { args, value } = txDescription;
  const { 0: outputToken } = args;
  // Convert to ether
  // TODO: pull into util
  const divisor = 1000000000000000000n; // 1e18, for conversion from wei to ether
  const etherBigInt = value / divisor;
  const remainderBigInt = value % divisor;
  const ether = Number(etherBigInt) + Number(remainderBigInt) / Number(divisor);

  const tokenOutAmount = logs.reduce((total, log) => {
    return log.address === outputToken ? total + Number(log.amount) : total;
  }, 0);
  const inputLog = logs.find((log) => log.address === WETH_CONTRACT_ADDRESS);
  const outputLog = logs.find((log) => log.address === outputToken);

  if (inputLog && outputLog) {
    return {
      tokenIn: {
        symbol: inputLog.symbol,
        amount: Number(ether).toString(),
      },
      tokenOut: {
        symbol: outputLog.symbol,
        amount: tokenOutAmount.toString(),
      },
    };
  }
}

export function multiplexBatchSellTokenForToken({
  txDescription,
  txReceipt,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TxDescription;
}) {
  const [inputContractAddress, outputContractAddress] = txDescription.args;

  if (
    typeof inputContractAddress === "string" &&
    typeof outputContractAddress === "string"
  ) {
    const tokenData = {
      [inputContractAddress]: { amount: "0", symbol: "" },
      [outputContractAddress]: { amount: "0", symbol: "" },
    };

    txReceipt.logs.forEach(({ address, symbol, amount }) => {
      if (address in tokenData) {
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
  const exchangeProxy = ZERO_EX_EXCHANGE_PROXY.toLowerCase();
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
  txDescription: TxDescription;
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
  txDescription: TxDescription;
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
  txDescription: TxDescription;
}) {
  return fillOtcOrderForEth({ txReceipt, txDescription });
}

export function fillLimitOrder({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TxDescription;
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

export function permitAndCall({
  txReceipt,
  txDescription,
}: {
  txReceipt: EnrichedTxReceipt;
  txDescription: TxDescription;
}) {
  const { 1: owner } = txDescription.args;
  const { logs } = txReceipt;
  if (typeof owner === "string") {
    const inputLog = logs.find((log) => log.from === owner.toLowerCase());
    const outputLog = logs.find((log) => log.to === owner.toLowerCase());

    if (inputLog && outputLog) {
      return extractTokenInfo(inputLog, outputLog);
    }
  }
}
