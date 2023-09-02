import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("permitAndCall on Ethereum", () => {
  // https://etherscan.io/tx/0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241
  it("parses swap", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "USDC",
        amount: "20",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      tokenOut: {
        symbol: "USDT",
        amount: "8.735176",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
    });
  });

  // https://etherscan.io/tx/0x96f00ee10fb5bc7a71865d0efef87e1105946b5a7a87d44ccc8a60fa852ba467
  it("parses swap with a meta transaction that wraps multiplexBatchSellTokenForEth using permitAndCall with 7 arguments", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0x96f00ee10fb5bc7a71865d0efef87e1105946b5a7a87d44ccc8a60fa852ba467",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "cbETH",
        amount: "0.15941858187679941",
        address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
      },
      tokenOut: {
        symbol: NATIVE_ASSET.symbol,
        amount: "0.1540473741459534",
        address: NATIVE_ASSET.address,
      },
    });
  });

  // https://etherscan.io/tx/0x142909f33e8b9882c73da6dc85193a81cd2bfa3bd39d485dd901d3b70e985ee4
  it("parses swap with a meta transaction that wraps transformERC20 using permitAndCall with 7 arguments", async () => {
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

  // https://etherscan.io/tx/0x911354147775d4460259809bf7606b6a0f06c70a788856bd7f9371411abf3a5e
  it("parses swap with a meta transaction that wraps multiplexBatchSellTokenForToken using permitAndCall with 7 arguments", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0x911354147775d4460259809bf7606b6a0f06c70a788856bd7f9371411abf3a5e",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "USDC",
        amount: "7967.727535",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      tokenOut: {
        symbol: "HEX",
        amount: "545031.76796769",
        address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
      },
    });
  });
});

describe("permitAndCall on Polygon", () => {
  const POLYGON_MAINNET_RPC = "https://rpc.ankr.com/polygon";

  // https://polygonscan.com/tx/0x407f0ffe42963d2f68beeac39c71d6db1530a90c9716ed4643de116abefcc642
  it("parses swap with a executeMetaTransactionV2 that wraps transformERC20 using permitAndCall with 6 arguments", async () => {
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

  // https://polygonscan.com/tx/0xc020f1a4265c44474544c2b38bf086ab5f463c8bde4f5aa394db3d1429ad42b8
  it("parses swap with a executeMetaTransactionV2 that wraps transformERC20 using permitAndCall with 7 arguments", async () => {
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
});
