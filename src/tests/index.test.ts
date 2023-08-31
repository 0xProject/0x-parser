import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { EXCHANGE_PROXY_ABI_URL } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xe393e03e31ba2b938326ef0527aba08b4e7f2d144ac2a2172c57615990698ee6
it("returns null when the transaction did not interact with 0x exchangeProxy or permitAndCall", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0xe393e03e31ba2b938326ef0527aba08b4e7f2d144ac2a2172c57615990698ee6",
  });

  expect(data).toBe(null);
});

// https://etherscan.io/tx/0x335b2a3faf4a15cd6f67f1ec7ed26ee04ea7cc248f5cd052967e6ae672af8d35
it("returns null when the transaction status is reverted", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0x335b2a3faf4a15cd6f67f1ec7ed26ee04ea7cc248f5cd052967e6ae672af8d35",
  });

  expect(data).toBe(null);
});

it("throws an error when required arguments are not passed", () => {
  expect(async () => {
    await parseSwap({
      transactionHash: "0x…",
      exchangeProxyAbi,
    } as any);
  }).rejects.toThrowError("Missing rpcUrl…");

  expect(async () => {
    await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
    } as any);
  }).rejects.toThrowError("Missing transaction hash…");

  expect(async () => {
    await parseSwap({
      transactionHash: "0x…",
      rpcUrl: ETH_MAINNET_RPC,
    } as any);
  }).rejects.toThrowError(
    `Missing 0x Exchange Proxy ABI: ${EXCHANGE_PROXY_ABI_URL}…`
  );
});

it("throws an error if the chainId is not supported", () => {
  expect(async () => {
    await parseSwap({
      exchangeProxyAbi,
      rpcUrl: "https://rpc.gnosis.gateway.fm",
      transactionHash:
        "0x689eaa9ad3db373b241330be646e450d5b8bb3faad7f0c3260c63b9ef6765fcb",
    });
  }).rejects.toThrowError("chainId 100 is unsupported…");
});
