import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xd6a7aeda4a2978c80b03700e3136c6895b48d08cd9c8d4c88dfd19dee0a12795
it("parses swap from sellToUniswap", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xd6a7aeda4a2978c80b03700e3136c6895b48d08cd9c8d4c88dfd19dee0a12795",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "0.016858343555927415",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      symbol: "USDT",
      amount: "30.149999",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  });
});
