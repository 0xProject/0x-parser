import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53
it("parses swap from fillOtcOrderWithEth", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: NATIVE_ASSET.symbol,
      amount: "0.9",
      address: NATIVE_ASSET.address,
    },
    tokenOut: {
      symbol: "USDC",
      amount: "1384.074396",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  });
});
