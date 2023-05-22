import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56

it("parses swap for multiplexBatchSellTokenForToken", async () => {
  const data = await parseSwap({
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    transactionHash:
      "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
    rpcUrl: RPC_TEST_URL,
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
