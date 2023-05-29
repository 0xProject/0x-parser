import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x3e22063b0a1be3e8a7a902b6a2ecd86d7753279ef368e21b99d23e431d759f71
it("parses swap for executeMetaTransactionV2 which wraps transformERC20", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x3e22063b0a1be3e8a7a902b6a2ecd86d7753279ef368e21b99d23e431d759f71",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "9960.981086",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "WBTC",
      amount: "0.35487978",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
  });
});

// https://etherscan.io/tx/0xc772258418e5d73bcf891ef341a42c0d74d8f84beda7f9e8580eacc0d62ba3c7
it("parses swap for executeMetaTransactionV2 which wraps multiplexBatchSellTokenForEth", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xc772258418e5d73bcf891ef341a42c0d74d8f84beda7f9e8580eacc0d62ba3c7",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      amount: "4972.542335",
      symbol: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    tokenOut: {
      amount: "2.6043201133029994",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});

// https://etherscan.io/tx/0xa4fa7313361c1be65bcec51217ad795028c8fd0ce9eacaff7aab546c29017921
it("parses swap for executeMetaTransactionV2 which wraps multiplexBatchSellTokenForToken", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xa4fa7313361c1be65bcec51217ad795028c8fd0ce9eacaff7aab546c29017921",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      amount: "2.886827",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      amount: "384833.18203482",
      symbol: "HEX",
      address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
    },
  });
});

// TODO: Implement me
// https://etherscan.io/tx/0xee3ffb65f6c8e07b46471cc610cf721affeefed87098c7db30a8147d50eb2a65
it.skip("parses swap for executeMetaTransactionV2 which wraps transformERC20", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xee3ffb65f6c8e07b46471cc610cf721affeefed87098c7db30a8147d50eb2a65",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      amount: "399.99",
      symbol: "cbETH",
      address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
    },
    tokenOut: {
      amount: "410.72390482871083",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});
