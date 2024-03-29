import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x5f0ed4396f68e0321e48d50611cc6663af68bf7cbee6bc8e74ff5c63d90f3b68
it("parses swap from fillTakerSignedOtcOrderForEth", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0x5f0ed4396f68e0321e48d50611cc6663af68bf7cbee6bc8e74ff5c63d90f3b68",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "25000",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: NATIVE_ASSET.symbol,
      amount: "13.848320444784979968",
      address: NATIVE_ASSET.address,
    },
  });
});
