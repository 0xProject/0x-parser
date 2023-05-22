import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xe59ff84284d7e2ad87f1a6de55d5d6600b0b721242110687847e57b52a045b7d
it("parses swap for multiplexBatchSellEthForToken", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xe59ff84284d7e2ad87f1a6de55d5d6600b0b721242110687847e57b52a045b7d",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "10",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      symbol: "X2Y2",
      amount: "90095.36724488341",
      address: "0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9",
    },
  });
});
