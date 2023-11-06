import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xbe734b761ccd45cc60a5b4828eb83da96405d663567a46041b049627dddf347d
it("parses swap from fillLimitOrder", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xbe734b761ccd45cc60a5b4828eb83da96405d663567a46041b049627dddf347d",
    exchangeProxyAbi,
    rpcUrl: "https://eth.llamarpc.com",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "1.6",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.001",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});
