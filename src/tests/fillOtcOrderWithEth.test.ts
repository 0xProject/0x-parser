import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53
it("parses swap for fillOtcOrderWithEth", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "0.9",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "1384.074396",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  });
});
