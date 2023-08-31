import { http, getAddress, decodeFunctionData, createPublicClient } from "viem";
import { mainnet } from "viem/chains";
import { parsers } from "./parsers";
import { permitAndCallAbi } from "./abi/PermitAndCall";
import {
  TRANSACTION_STATUS,
  EXCHANGE_PROXY_ABI_URL,
  EXCHANGE_PROXY_BY_CHAIN_ID,
  PERMIT_AND_CALL_BY_CHAIN_ID,
} from "./constants";
import { isChainIdSupported, isPermitAndCallChainId } from "./utils";
import type { ParseSwapArgs, PermitAndCallArgs } from "./types";

export * from "./types";

export async function parseSwap({
  transactionHash,
  exchangeProxyAbi,
  rpcUrl,
}: ParseSwapArgs) {
  if (!rpcUrl) throw new Error("Missing rpcUrl…");
  if (!transactionHash) throw new Error("Missing transaction hash…");
  if (!exchangeProxyAbi) {
    throw new Error(`Missing 0x Exchange Proxy ABI: ${EXCHANGE_PROXY_ABI_URL}…`);
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
    throw new Error(`chainId ${chainId} is unsupported…`);
  }

  const exchangeProxy = EXCHANGE_PROXY_BY_CHAIN_ID[chainId];

  const permitAndCallAddress = isPermitAndCallChainId(chainId)
    ? PERMIT_AND_CALL_BY_CHAIN_ID[chainId]
    : undefined;

  // The `to` property is null only in the case of a contract creation transaction,
  // which never occurs in the context of the 0x-parser. Use TypeScript's
  // non-null assertion operator to indicate that the to property will always be present.
  const to = getAddress(transaction.to!);

  const isToExchangeProxy = to === getAddress(exchangeProxy);

  const isToPermitAndCall = permitAndCallAddress
    ? to === getAddress(permitAndCallAddress)
    : false;

  if (!isToExchangeProxy && !isToPermitAndCall) {
    return null;
  }

  const { functionName: topLevelFunctionName } =
    to === permitAndCallAddress
      ? decodeFunctionData({
          abi: permitAndCallAbi,
          data: transaction.input,
        })
      : decodeFunctionData({
          abi: exchangeProxyAbi,
          data: transaction.input,
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

    const parser = parsers[exchangeProxyFn];

    return parser({
      chainId,
      callData,
      transaction,
      publicClient,
      exchangeProxyAbi,
      transactionReceipt,
    });
  }

  const parser = parsers[topLevelFunctionName];

  return parser({
    chainId,
    transaction,
    publicClient,
    exchangeProxyAbi,
    transactionReceipt,
    callData: transaction.input,
  });
}
