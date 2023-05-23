import { Contract, JsonRpcProvider } from "ethers";
import { abi as permitAndCallAbi } from "./abi/PermitAndCall.json";
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
import {
  CONTRACTS,
  ERC20_TRANSFER_EVENT_HASH,
  EXCHANGE_PROXY_ABI_URL,
} from "./constants";
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
  transactionHash,
  exchangeProxyAbi,
  rpcUrl,
}: ParseSwapArgs) {
  if (!rpcUrl) throw new Error("Missing rpcUrl");
  if (!transactionHash) throw new Error("Missing transaction hash");
  if (!exchangeProxyAbi)
    throw new Error(
      `Missing 0x Exchange Proxy ABI, which can be found here: ${EXCHANGE_PROXY_ABI_URL}`
    );

  const provider = new JsonRpcProvider(rpcUrl);

  const [tx, txReceipt] = await Promise.all([
    provider.getTransaction(transactionHash),
    provider.getTransactionReceipt(transactionHash),
  ]);

  if (tx && txReceipt) {
    const contract =
      txReceipt.to === CONTRACTS.permitAndCall
        ? new Contract(CONTRACTS.permitAndCall, permitAndCallAbi)
        : new Contract(CONTRACTS.exchangeProxy.ethereum, exchangeProxyAbi);

    const txDescription = contract.interface.parseTransaction(tx);

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

    const parser = txDescription ? logParsers[txDescription.name] : null;

    return parser && txDescription
      ? parser({ txDescription, txReceipt: txReceiptEnriched })
      : null;
  }
}
