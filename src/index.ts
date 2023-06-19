import { Contract, JsonRpcProvider } from "ethers";
import { abi as permitAndCallAbi } from "./abi/PermitAndCall.json";
import multicall3Abi from "./abi/Multicall3.json";
import { CONTRACTS, EXCHANGE_PROXY_ABI_URL, MULTICALL3 } from "./constants";
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
  sellToUniswap,
  sellTokenForEthToUniswapV3,
  sellEthForTokenToUniswapV3,
  sellTokenForTokenToUniswapV3,
  sellToLiquidityProvider,
  sellToPancakeSwap,
  transformERC20,
} from "./parsers";
import { enrichTxReceipt } from "./utils";
import { TransactionStatus } from "./types";
import type {
  Mtx,
  LogParsers,
  ParseSwapArgs,
  ParseGaslessTxArgs,
} from "./types";

export * from "./types";

export async function parseSwap({
  transactionHash,
  exchangeProxyAbi,
  rpcUrl,
}: ParseSwapArgs) {
  if (!rpcUrl) throw new Error("Missing rpcUrl");
  if (!transactionHash) throw new Error("Missing transaction hash");
  if (!exchangeProxyAbi)
    throw new Error(`Missing 0x Exchange Proxy ABI: ${EXCHANGE_PROXY_ABI_URL}`);

  const provider = new JsonRpcProvider(rpcUrl);

  const [tx, txReceipt] = await Promise.all([
    provider.getTransaction(transactionHash),
    provider.getTransactionReceipt(transactionHash),
  ]);

  if (tx && txReceipt) {
    if (txReceipt.status === TransactionStatus.REVERTED) return null;

    const chainId = Number(tx.chainId);
    const exchangeProxyContract = new Contract(
      CONTRACTS.exchangeProxy.ethereum,
      exchangeProxyAbi
    );
    const permitAndCallContract = new Contract(
      CONTRACTS.permitAndCall,
      permitAndCallAbi
    );
    const txDescription =
      txReceipt.to === CONTRACTS.permitAndCall
        ? permitAndCallContract.interface.parseTransaction(tx)
        : exchangeProxyContract.interface.parseTransaction(tx);

    if (txDescription === null) {
      return null;
    }

    const multicall = new Contract(MULTICALL3, multicall3Abi, provider);

    const tryBlockAndAggregate =
      multicall[
        "tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls)"
      ];

    const txReceiptEnriched = await enrichTxReceipt({
      txReceipt,
      tryBlockAndAggregate,
    });

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
      sellToUniswap,
      sellTokenForEthToUniswapV3,
      sellEthForTokenToUniswapV3,
      sellTokenForTokenToUniswapV3,
      sellToLiquidityProvider,
      sellToPancakeSwap,
    };

    const parser = logParsers[txDescription.name];

    if (txDescription.name === "permitAndCall") {
      const calldataFromPermitAndCall = txDescription.args[7];
      const permitAndCallDescription =
        exchangeProxyContract.interface.parseTransaction({
          data: calldataFromPermitAndCall,
        });

      if (permitAndCallDescription) {
        return parseGaslessTx({
          rpcUrl,
          chainId,
          txReceipt,
          logParsers,
          txReceiptEnriched,
          exchangeProxyContract,
          transactionDescription: permitAndCallDescription,
        });
      }
    }

    if (txDescription.name === "executeMetaTransactionV2") {
      return parseGaslessTx({
        rpcUrl,
        chainId,
        txReceipt,
        logParsers,
        txReceiptEnriched,
        exchangeProxyContract,
        transactionDescription: txDescription,
      });
    }

    if (txDescription.name === "transformERC20") {
      return transformERC20({
        rpcUrl,
        chainId,
        contract: exchangeProxyContract,
        transactionReceipt: txReceipt,
      });
    }

    return parser({
      txDescription,
      txReceipt: txReceiptEnriched,
    });
  }
}

function parseGaslessTx({
  rpcUrl,
  chainId,
  logParsers,
  txReceipt,
  txReceiptEnriched,
  exchangeProxyContract,
  transactionDescription,
}: ParseGaslessTxArgs) {
  const [mtx] = transactionDescription.args;
  const { 0: signer, 4: data, 6: fees } = mtx as Mtx;
  const [recipient] = fees[0];
  const { logs } = txReceiptEnriched;
  const filteredLogs = logs.filter((log) => log.to !== recipient.toLowerCase());
  const mtxV2Description = exchangeProxyContract.interface.parseTransaction({
    data,
  });

  let parser = logParsers[transactionDescription.name];
  if (mtxV2Description) {
    const parser = logParsers[mtxV2Description.name];

    return mtxV2Description.name === "transformERC20"
      ? transformERC20({
          rpcUrl,
          chainId,
          contract: exchangeProxyContract,
          transactionReceipt: txReceipt,
        })
      : parser({
          txDescription: mtxV2Description,
          txReceipt: { from: signer, logs: filteredLogs },
        });
  }

  return parser({
    txDescription: transactionDescription,
    txReceipt: { from: signer, logs: filteredLogs },
  });
}
