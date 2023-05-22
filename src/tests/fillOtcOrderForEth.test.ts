import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7
it("parses swap for fillOtcOrderForEth", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "218.441376",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.1254399221596278",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});
