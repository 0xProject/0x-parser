import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xd6a7aeda4a2978c80b03700e3136c6895b48d08cd9c8d4c88dfd19dee0a12795
it("parses a single hop swap from sellToUniswap", async () => {
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

// https://etherscan.io/tx/0x380eebed81807391a70aac7f02cc852d441ccf0b7cf6538f7a472750e551720b
it("parses a multihop swap from sellToUniswap", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x380eebed81807391a70aac7f02cc852d441ccf0b7cf6538f7a472750e551720b",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "1000",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "SOLANA",
      amount: "497767771055.529611406221129532",
      address: "0x3D806324b6Df5AF3c1a81aCbA14A8A62Fe6D643F",
    },
  });
});
