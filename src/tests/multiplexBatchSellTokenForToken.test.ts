import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56

it("parses swap from multiplexBatchSellTokenForToken", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
  });

  expect(data).toEqual({
    tokenIn: {
      amount: "329656.871822",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      amount: "11.5568887",
      symbol: "WBTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
  });
});
