import { http, getAddress, decodeFunctionData, createPublicClient } from "viem";
import { mainnet } from "viem/chains";
import { logParsers } from "./parsers";
import { permitAndCallAbi } from "./abi/PermitAndCall";
import {
  isChainIdSupported,
  isPermitAndCallChainId,
  enrichTransactionReceipt,
} from "./utils";
import {
  TRANSACTION_STATUS,
  EXCHANGE_PROXY_ABI_URL,
  EXCHANGE_PROXY_BY_CHAIN_ID,
  PERMIT_AND_CALL_BY_CHAIN_ID,
} from "./constants";
import type { ParseSwapArgs, PermitAndCallArgs } from "./types";

export * from "./types";

export async function parseSwap({
  transactionHash,
  exchangeProxyAbi,
  rpcUrl,
}: ParseSwapArgs) {
  if (!rpcUrl) throw new Error("Missing rpcUrl");
  if (!transactionHash) throw new Error("Missing transaction hash");
  if (!exchangeProxyAbi) {
    throw new Error(`Missing 0x Exchange Proxy ABI: ${EXCHANGE_PROXY_ABI_URL}`);
  }

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  const chainId = await publicClient.getChainId();

  const transactionReceipt = await publicClient.getTransactionReceipt({
    hash: transactionHash,
  });

  const transaction = await publicClient.getTransaction({
    hash: transactionHash,
  });

  if (transactionReceipt.status === TRANSACTION_STATUS.REVERTED) {
    return null;
  }

  if (!isChainIdSupported(chainId)) {
    throw new Error(`chainId ${chainId} is unsupported.`);
  }

  const exchangeProxy = EXCHANGE_PROXY_BY_CHAIN_ID[chainId];

  const permitAndCallAddress = isPermitAndCallChainId(chainId)
    ? PERMIT_AND_CALL_BY_CHAIN_ID[chainId]
    : undefined;

  // The `to` property is null only in the case of a contract creation transaction,
  // which never occurs in the context of the 0x-parser. Use TypeScript's
  // non-null assertion operator to indicate that the to property will always be present.
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

  const txReceipt = await enrichTransactionReceipt({
    publicClient,
    transactionReceipt,
  });

  if (topLevelFunctionName === "permitAndCall") {
    const { args: permitAndCallArgs } = decodeFunctionData({
      abi: permitAndCallAbi,
      data: transaction.input,
    });
    const { 7: callData } = permitAndCallArgs as PermitAndCallArgs;
    const { functionName: exchangeProxyFn } = decodeFunctionData({
      abi: exchangeProxyAbi,
      data: callData,
    });

    const parser = logParsers[exchangeProxyFn];

    return parser({
      chainId,
      callData,
      txReceipt,
      transaction,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
    });
  }

  const parser = logParsers[topLevelFunctionName];

  return parser({
    chainId,
    txReceipt,
    transaction,
    publicClient,
    exchangeProxyAbi,
    transactionReceipt,
    callData: transaction.input,
  });
}
