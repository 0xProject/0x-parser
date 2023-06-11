import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xe59ff84284d7e2ad87f1a6de55d5d6600b0b721242110687847e57b52a045b7d
it("parses swap from multiplexBatchSellEthForToken", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xe59ff84284d7e2ad87f1a6de55d5d6600b0b721242110687847e57b52a045b7d",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
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
