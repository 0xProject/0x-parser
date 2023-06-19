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
  ProcessReceiptArgs,
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

  const [tx, transactionReceipt] = await Promise.all([
    provider.getTransaction(transactionHash),
    provider.getTransactionReceipt(transactionHash),
  ]);

  if (tx && transactionReceipt) {
    if (transactionReceipt.status === TransactionStatus.REVERTED) return null;

    const chainId = Number(tx.chainId);
    const exchangeProxyContract = new Contract(
      CONTRACTS.exchangeProxy.ethereum,
      exchangeProxyAbi
    );
    const permitAndCallContract = new Contract(
      CONTRACTS.permitAndCall,
      permitAndCallAbi
    );
    const transactionDescription =
      transactionReceipt.to === CONTRACTS.permitAndCall
        ? permitAndCallContract.interface.parseTransaction(tx)
        : exchangeProxyContract.interface.parseTransaction(tx);

    if (transactionDescription === null) {
      return null;
    }

    const multicall = new Contract(MULTICALL3, multicall3Abi, provider);

    const tryBlockAndAggregate =
      multicall[
        "tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls)"
      ];

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

    const parser = logParsers[transactionDescription.name];

    if (transactionDescription.name === "permitAndCall") {
      const calldataFromPermitAndCall = transactionDescription.args[7];
      const permitAndCallDescription =
        exchangeProxyContract.interface.parseTransaction({
          data: calldataFromPermitAndCall,
        });

      if (permitAndCallDescription) {
        return parseGaslessTx({
          chainId,
          logParsers,
          tryBlockAndAggregate,
          exchangeProxyContract,
          transactionReceipt,
          transactionDescription: permitAndCallDescription,
        });
      }
    }

    if (transactionDescription.name === "executeMetaTransactionV2") {
      return parseGaslessTx({
        chainId,
        logParsers,
        exchangeProxyContract,
        tryBlockAndAggregate,
        transactionReceipt,
        transactionDescription,
      });
    }

    if (transactionDescription.name === "transformERC20") {
      return transformERC20({
        chainId,
        transactionReceipt,
        tryBlockAndAggregate,
        contract: exchangeProxyContract,
      });
    }

    const txReceiptEnriched = await enrichTxReceipt({
      transactionReceipt,
      tryBlockAndAggregate,
    });

    return parser({
      txDescription: transactionDescription,
      txReceipt: txReceiptEnriched,
    });
  }
}

async function parseGaslessTx({
  chainId,
  logParsers,
  exchangeProxyContract,
  tryBlockAndAggregate,
  transactionReceipt,
  transactionDescription,
}: ParseGaslessTxArgs) {
  const [mtx] = transactionDescription.args;
  const { 0: signer, 4: data, 6: fees } = mtx as Mtx;
  const [recipient] = fees[0];
  const mtxV2Description = exchangeProxyContract.interface.parseTransaction({
    data,
  });

  if (mtxV2Description) {
    if (mtxV2Description.name === "transformERC20") {
      return transformERC20({
        chainId,
        transactionReceipt,
        tryBlockAndAggregate,
        contract: exchangeProxyContract,
      });
    } else {
      const parser = logParsers[mtxV2Description.name];

      return processReceipt({
        signer,
        parser,
        recipient,
        tryBlockAndAggregate,
        transactionReceipt,
        transactionDescription: mtxV2Description,
      });
    }
  }

  const parser = logParsers[transactionDescription.name];

  return processReceipt({
    signer,
    parser,
    recipient,
    tryBlockAndAggregate,
    transactionReceipt,
    transactionDescription,
  });
}

async function processReceipt({
  signer,
  parser,
  recipient,
  tryBlockAndAggregate,
  transactionReceipt,
  transactionDescription,
}: ProcessReceiptArgs) {
  const enrichedTxReceipt = await enrichTxReceipt({
    transactionReceipt,
    tryBlockAndAggregate,
  });

  const { logs } = enrichedTxReceipt;
  const filteredLogs = logs.filter((log) => log.to !== recipient.toLowerCase());

  return parser({
    txDescription: transactionDescription,
    txReceipt: { from: signer, logs: filteredLogs },
  });
}
