import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7
it("parses swap from fillOtcOrderForEth", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "218.441376",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    tokenOut: {
      symbol: NATIVE_ASSET.symbol,
      amount: "0.1254399221596278",
      address: NATIVE_ASSET.address,
    },
  });
});
