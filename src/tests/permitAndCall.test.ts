import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("permitAndCall", () => {
  // https://etherscan.io/tx/0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241
  it("parses swap", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
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
  it("parses swap with a meta transaction that wraps multiplexBatchSellTokenForEth", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x96f00ee10fb5bc7a71865d0efef87e1105946b5a7a87d44ccc8a60fa852ba467",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "cbETH",
        amount: "0.15941858187679941",
        address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
      },
      tokenOut: {
        symbol: "ETH",
        amount: "0.1540473741459534",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
    });
  });

  // https://etherscan.io/tx/0x142909f33e8b9882c73da6dc85193a81cd2bfa3bd39d485dd901d3b70e985ee4
  it("parses swap with a meta transaction that wraps transformERC20", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x142909f33e8b9882c73da6dc85193a81cd2bfa3bd39d485dd901d3b70e985ee4",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "BAL",
        amount: "50.883400023914484682",
        address: "0xba100000625a3754423978a60c9317c58a424e3D",
      },
      tokenOut: {
        symbol: "ETH",
        amount: "0.144785082557763087",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
    });
  });

  // https://etherscan.io/tx/0x911354147775d4460259809bf7606b6a0f06c70a788856bd7f9371411abf3a5e
  it("parses swap with a meta transaction that wraps multiplexBatchSellTokenForToken", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x911354147775d4460259809bf7606b6a0f06c70a788856bd7f9371411abf3a5e",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
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
