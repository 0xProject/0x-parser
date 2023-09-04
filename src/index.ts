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
import type { ParseSwapArgs } from "./types";

export * from "./types";

export async function parseSwap({
  transactionHash,
  exchangeProxyAbi,
  rpcUrl,
}: ParseSwapArgs) {
  if (!rpcUrl) throw new Error("Missing rpcUrl…");
  if (!transactionHash) throw new Error("Missing transaction hash…");
  if (!exchangeProxyAbi) {
    throw new Error(
      `Missing 0x Exchange Proxy ABI: ${EXCHANGE_PROXY_ABI_URL}…`
    );
  }

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  const chainId = await publicClient.getChainId();

  const transactionReceipt = await publicClient.getTransactionReceipt({
    hash: transactionHash,
  });

  if (transactionReceipt.status === TRANSACTION_STATUS.REVERTED) {
    return null;
  }

  const transaction = await publicClient.getTransaction({
    hash: transactionHash,
  });

  if (!isChainIdSupported(chainId)) {
    throw new Error(`chainId ${chainId} is unsupported…`);
  }

  const exchangeProxy = EXCHANGE_PROXY_BY_CHAIN_ID[chainId];

  const permitAndCall = isPermitAndCallChainId(chainId)
    ? PERMIT_AND_CALL_BY_CHAIN_ID[chainId]
    : null;

  // The `to` property is null only in the case of a contract creation transaction,
  // which never occurs in the context of the 0x-parser. Use TypeScript's non-null
  // assertion operator to indicate that the `to` property will always be present.
  const to = getAddress(transaction.to!);

  const isToExchangeProxy = to === exchangeProxy;

  const isToPermitAndCall = to === permitAndCall;

  if (!isToExchangeProxy && !isToPermitAndCall) {
    return null;
  }

  const { functionName } = isToExchangeProxy
    ? decodeFunctionData({
        abi: exchangeProxyAbi,
        data: transaction.input,
      })
    : decodeFunctionData({
        abi: permitAndCallAbi,
        data: transaction.input,
      });

  const parser = parsers[functionName];

  return parser({
    chainId,
    transaction,
    publicClient,
    exchangeProxyAbi,
    transactionReceipt,
    callData: transaction.input,
  });
}
