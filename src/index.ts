import { mainnet } from "viem/chains";
import { http, getAddress, decodeFunctionData, createPublicClient } from "viem";
import { logParsers, transformERC20 } from "./parsers";
import { abi as permitAndCallAbi } from "./abi/PermitAndCall.json";
import {
  enrichTxReceiptForViem,
  isChainIdSupported,
  isPermitAndCallChainId,
} from "./utils";
import {
  EXCHANGE_PROXY_ABI_URL,
  EXCHANGE_PROXY_BY_CHAIN_ID,
  PERMIT_AND_CALL_BY_CHAIN_ID,
} from "./constants";
import { TransactionStatus } from "./types";
import type {
  ParseSwapArgs,
  PermitAndCallArgs,
  MetaTransactionArgs,
  ParseMetaTransactionV2Args,
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

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  const chainId = await publicClient.getChainId();

  const transactionReceipt = await publicClient.getTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  const transaction = await publicClient.getTransaction({
    hash: transactionHash as `0x${string}`,
  });

  if (transactionReceipt.status === TransactionStatus.REVERTED) {
    return null;
  }

  if (!isChainIdSupported(chainId)) {
    throw new Error(`chainId ${chainId} is unsupported.`);
  }

  const exchangeProxy = EXCHANGE_PROXY_BY_CHAIN_ID[chainId];

  const permitAndCallAddress = isPermitAndCallChainId(chainId)
    ? PERMIT_AND_CALL_BY_CHAIN_ID[chainId]
    : undefined;

  // The `to` property is `null` when the transaction is a contract creation, which never applies to 0x-parser.
  const to = getAddress(transaction.to!);

  const isToExchangeProxy = getAddress(to) === getAddress(exchangeProxy);

  const isToPermitAndCallAddress = permitAndCallAddress
    ? getAddress(to) === getAddress(permitAndCallAddress)
    : false;

  if (!isToExchangeProxy && !isToPermitAndCallAddress) {
    return null;
  }

  const { functionName: topLevelFunctionName } =
    getAddress(to) === permitAndCallAddress
      ? decodeFunctionData({
          abi: permitAndCallAbi,
          data: transaction.input,
        })
      : decodeFunctionData({
          abi: exchangeProxyAbi,
          data: transaction.input,
        });

  const parser = logParsers[topLevelFunctionName];

  if (topLevelFunctionName === "permitAndCall") {
    const { args } = decodeFunctionData({
      abi: permitAndCallAbi,
      data: transaction.input,
    });
    const { 7: callData } = args as PermitAndCallArgs;
    const { functionName: exchangeProxyFn } = decodeFunctionData({
      abi: exchangeProxyAbi,
      data: callData,
    });
    const parser = logParsers[exchangeProxyFn];
    const enrichedTxReceipt = await enrichTxReceiptForViem({
      publicClient,
      transactionReceipt,
    });
    const { logs } = enrichedTxReceipt;

    if (exchangeProxyFn === "executeMetaTransactionV2") {
      return parseMetaTransactionV2({
        chainId,
        logParsers,
        transaction,
        publicClient,
        exchangeProxyAbi,
        transactionReceipt,
        callDataMtx: callData,
      });
    }

    return parser({
      callData,
      transaction,
      exchangeProxyAbi,
      transactionReceipt,
      txReceipt: { from: transactionReceipt.from, logs },
    });
  }

  if (topLevelFunctionName === "executeMetaTransactionV2") {
    return parseMetaTransactionV2({
      chainId,
      logParsers,
      transaction,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
      callDataMtx: transaction.input,
    });
  }

  // TODO: This should be refactored into parsers if possible.
  if (topLevelFunctionName === "transformERC20") {
    return transformERC20({
      chainId,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
    });
  }

  const txReceiptEnriched = await enrichTxReceiptForViem({
    publicClient,
    transactionReceipt,
  });

  return parser({
    transaction,
    exchangeProxyAbi,
    transactionReceipt,
    txReceipt: txReceiptEnriched,
    callData: transaction.input,
  });
}

// TODO: Move this into parsers and rename to executeMetaTransactionV2.
async function parseMetaTransactionV2({
  chainId,
  logParsers,
  transaction,
  callDataMtx,
  publicClient,
  exchangeProxyAbi,
  transactionReceipt,
}: ParseMetaTransactionV2Args) {
  const { args } = decodeFunctionData({
    data: callDataMtx,
    abi: exchangeProxyAbi,
  });
  const [mtx] = args as MetaTransactionArgs;
  const { signer, callData, fees } = mtx;
  const { recipient } = fees[0];

  const functionDataForMtx = decodeFunctionData({
    data: callData,
    abi: exchangeProxyAbi,
  });

  if (functionDataForMtx.functionName === "transformERC20") {
    return transformERC20({
      chainId,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
    });
  } else {
    const parser = logParsers[functionDataForMtx.functionName];
    const enrichedTxReceipt = await enrichTxReceiptForViem({
      publicClient,
      transactionReceipt,
    });
    const { logs } = enrichedTxReceipt;
    const filteredLogs = logs.filter(
      (log) => log.to !== recipient.toLowerCase()
    );

    return parser({
      callData,
      transaction,
      exchangeProxyAbi,
      transactionReceipt,
      txReceipt: { from: signer, logs: filteredLogs },
    });
  }
}
