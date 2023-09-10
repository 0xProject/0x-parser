import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

const POLYGON_MAINNET_RPC = "https://rpc.ankr.com/polygon";

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("permitAndCall", () => {
  // https://etherscan.io/tx/0x142909f33e8b9882c73da6dc85193a81cd2bfa3bd39d485dd901d3b70e985ee4
  it("IERC2612: parses swap with permit and call on Ethereum with canonical permit", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0x142909f33e8b9882c73da6dc85193a81cd2bfa3bd39d485dd901d3b70e985ee4",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "BAL",
        amount: "50.883400023914484682",
        address: "0xba100000625a3754423978a60c9317c58a424e3D",
      },
      tokenOut: {
        symbol: NATIVE_ASSET.symbol,
        amount: "0.144785082557763087",
        address: NATIVE_ASSET.address,
      },
    });
  });

  // https://polygonscan.com/tx/0xc020f1a4265c44474544c2b38bf086ab5f463c8bde4f5aa394db3d1429ad42b8
  it("IERC2612: parses swap with permit and call on Polygon with canonical permit", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: POLYGON_MAINNET_RPC,
      transactionHash:
        "0xc020f1a4265c44474544c2b38bf086ab5f463c8bde4f5aa394db3d1429ad42b8",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        amount: "3.598205",
        symbol: "USDC",
      },
      tokenOut: {
        address: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
        amount: "6.876078336435440124",
        symbol: "STG",
      },
    });
  });

  // https://etherscan.io/tx/0x2e48f20033a45c7a7e1f926db51b1876c5a6a2042bf8e06b17ddbdd58f3b67ab
  it("IERC20PermitAllowed: parses swap with permit and call on Ethereum with dai permit ", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0x2e48f20033a45c7a7e1f926db51b1876c5a6a2042bf8e06b17ddbdd58f3b67ab",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "DAI",
        amount: "2502.47",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      tokenOut: {
        symbol: "USDT",
        amount: "2494.136763",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
    });
  });

  // https://polygonscan.com/tx/0x407f0ffe42963d2f68beeac39c71d6db1530a90c9716ed4643de116abefcc642
  it("IERC20MetaTransaction: parses swap with permit and call on Polygon with meta transaction", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: POLYGON_MAINNET_RPC,
      transactionHash:
        "0x407f0ffe42963d2f68beeac39c71d6db1530a90c9716ed4643de116abefcc642",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        amount: "1152.957063922541296658",
        symbol: "DAI",
      },
      tokenOut: {
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        amount: "0.714510898374948536",
        symbol: "WETH",
      },
    });
  });
});
