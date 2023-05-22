import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x90dbdd630287a0412f88cbc98b0d751bc81c613bb285898dac461b523cd07a5a
it("parses swap for sellTokenForTokenToUniswapV3", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x90dbdd630287a0412f88cbc98b0d751bc81c613bb285898dac461b523cd07a5a",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "3500",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "CRV",
      amount: "3490.286498060619473095",
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    },
  });
});
