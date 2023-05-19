import {
  fillLimitOrder,
  fillOtcOrder,
  fillOtcOrderForEth,
  fillOtcOrderWithEth,
  fillTakerSignedOtcOrder,
  fillTakerSignedOtcOrderForEth,
  executeMetaTransaction,
  multiplexBatchSellTokenForToken,
  multiplexBatchSellTokenForEth,
  multiplexBatchSellEthForToken,
  multiplexMultiHopSellTokenForToken,
  multiplexMultiHopSellEthForToken,
  multiplexMultiHopSellTokenForEth,
  permitAndCall,
  sellToUniswap,
  sellTokenForEthToUniswapV3,
  sellEthForTokenToUniswapV3,
  sellTokenForTokenToUniswapV3,
  sellToLiquidityProvider,
  sellToPancakeSwap,
  transformERC20,
} from "./parsers";
import { ERC20_TRANSFER_EVENT_HASH } from "./constants";
import { erc20Rpc, formatUnits, convertHexToAddress } from "./utils";
import { TransactionStatus } from "./types";
import type {
  Log,
  LogParsers,
  EnrichedTxReceipt,
  EnrichedLogWithoutAmount,
  ParseSwapArgs,
  ProcessedLog,
  TransactionReceipt,
} from "./types";

async function enrichLog({
  log,
  rpcUrl,
}: {
  log: Log;
  rpcUrl: string;
}): Promise<EnrichedLogWithoutAmount> {
  const [symbol, decimals] = await Promise.all([
    erc20Rpc.getSymbol(log.address, rpcUrl),
    erc20Rpc.getDecimals(log.address, rpcUrl),
  ]);

  return { ...log, symbol, decimals };
}

function processLog(log: EnrichedLogWithoutAmount): ProcessedLog {
  const { topics, data, decimals, symbol, address } = log;
  const { 1: fromHex, 2: toHex } = topics;
  const from = convertHexToAddress(fromHex);
  const to = convertHexToAddress(toHex);
  const amount = formatUnits(data, decimals);

  return { to, from, symbol, amount, address, decimals };
}

async function enrichTxReceipt({
  txReceipt,
  rpcUrl,
}: {
  txReceipt: TransactionReceipt;
  rpcUrl: string;
}): Promise<EnrichedTxReceipt> {
  const isERC20TransferEvent = (log: Log) =>
    log.topics[0] === ERC20_TRANSFER_EVENT_HASH;
  const filteredLogs = txReceipt.logs.filter(isERC20TransferEvent);
  const enrichedLogs = await Promise.all(
    filteredLogs.map((log) => enrichLog({ log, rpcUrl }))
  );
  const logs = enrichedLogs.map(processLog);

  return { logs, from: txReceipt.from };
}

export async function parseSwap({
  txReceipt,
  txDescription,
  rpcUrl,
}: ParseSwapArgs) {
  if (txReceipt.status === TransactionStatus.REVERTED) return null;
  const txReceiptEnriched = await enrichTxReceipt({ txReceipt, rpcUrl });
  const logParsers: LogParsers = {
    fillLimitOrder,
    fillOtcOrder,
    fillOtcOrderForEth,
    fillOtcOrderWithEth,
    fillTakerSignedOtcOrder,
    fillTakerSignedOtcOrderForEth,
    executeMetaTransaction,
    multiplexBatchSellTokenForToken,
    multiplexBatchSellTokenForEth,
    multiplexBatchSellEthForToken,
    multiplexMultiHopSellTokenForToken,
    multiplexMultiHopSellEthForToken,
    multiplexMultiHopSellTokenForEth,
    permitAndCall,
    sellToUniswap,
    sellTokenForEthToUniswapV3,
    sellEthForTokenToUniswapV3,
    sellTokenForTokenToUniswapV3,
    sellToLiquidityProvider,
    sellToPancakeSwap,
    transformERC20,
  };
  const parser = logParsers[txDescription.name];

  return parser
    ? parser({ txDescription, txReceipt: txReceiptEnriched })
    : null;
}
