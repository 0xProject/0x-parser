import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x2a4379d531695dd4f142730edb7720bb9d06dfb405322e0e16acbfd8ba4fcb98
it("parses swap for sellToLiquidityProvider", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x2a4379d531695dd4f142730edb7720bb9d06dfb405322e0e16acbfd8ba4fcb98",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "STG",
      amount: "918.996239437320809884",
      address: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "692.783026",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  });
});
