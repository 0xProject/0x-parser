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
  EVENT_SIGNATURES,
  EXCHANGE_PROXY_ABI_URL,
} from "./constants";
import { erc20Rpc, formatUnits, convertHexToAddress } from "./utils";
import { TransactionStatus } from "./types";
import type {
  Mtx,
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
    log.topics[0] === EVENT_SIGNATURES.Transfer;
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
    const chainId = Number(tx.chainId);
    const contract =
      txReceipt.to === CONTRACTS.permitAndCall
        ? new Contract(CONTRACTS.permitAndCall, permitAndCallAbi)
        : new Contract(CONTRACTS.exchangeProxy.ethereum, exchangeProxyAbi);

    const txDescription = contract.interface.parseTransaction(tx);

    if (txReceipt.status === TransactionStatus.REVERTED) return null;

    if (txDescription === null) {
      return null;
    }

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
    };

    const parser = logParsers[txDescription.name];

    if (txDescription.name === "executeMetaTransactionV2") {
      const [mtx] = txDescription.args;
      const { 0: signer, 4: data, 6: fees } = mtx as Mtx;
      const [recipient] = fees[0];
      const { logs } = txReceiptEnriched;
      const filteredLogs = logs.filter(
        (log) => log.to !== recipient.toLowerCase()
      );

      const mtxV2Description = contract.interface.parseTransaction({ data });

      if (mtxV2Description) {
        const parser = logParsers[mtxV2Description.name];

        return mtxV2Description.name === "transformERC20"
          ? transformERC20({
              rpcUrl,
              chainId,
              contract,
              transactionReceipt: txReceipt,
            })
          : parser({
              txDescription: mtxV2Description,
              txReceipt: { from: signer, logs: filteredLogs },
            });
      }
    }

    if (txDescription.name === "transformERC20") {
      return transformERC20({
        rpcUrl,
        chainId,
        contract,
        transactionReceipt: txReceipt,
      });
    }

    return parser({
      txDescription,
      txReceipt: txReceiptEnriched,
    });
  }
}
