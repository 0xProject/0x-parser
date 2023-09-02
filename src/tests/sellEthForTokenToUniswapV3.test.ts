import { expect, it } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x54362c24134d62243ea80dd0e7f77f0c62718f25fbffc6caafdd7b52f702359c
it("parses swap from sellEthForTokenToUniswapV3", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0x54362c24134d62243ea80dd0e7f77f0c62718f25fbffc6caafdd7b52f702359c",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "ETH",
      amount: "0.098091206429872",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    tokenOut: {
      symbol: "똥코인",
      amount: "49330077428.84485198095946916",
      address: "0x4208Aa4d7A9a10f4f8bb7f6400c1b2161D946969",
    },
  });
});

// https://etherscan.io/tx/0x93e0e2967309835c4eb5443b67b6c886839b6a5c0626d33c7df976153cb224d7
it("parses swap from sellEthForTokenToUniswapV3", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash:
      "0x93e0e2967309835c4eb5443b67b6c886839b6a5c0626d33c7df976153cb224d7",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: NATIVE_ASSET.symbol,
      amount: "0.12864375786794413",
      address: NATIVE_ASSET.address,
    },
    tokenOut: {
      symbol: "CGPT",
      amount: "3895.128022043192070174",
      address: "0x25931894a86D47441213199621F1F2994e1c39Aa",
    },
  });
});
