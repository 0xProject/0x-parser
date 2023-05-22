import { it, expect, describe } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("transformERC20 with native input asset", () => {
  // https://etherscan.io/tx/0x30d015e87dd5481609eec1c54433b8d4679fe641034971baf648d4528a9b0a35
  it("parses swap for transformERC20", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x30d015e87dd5481609eec1c54433b8d4679fe641034971baf648d4528a9b0a35",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "ETH",
        amount: "332.66606783645324",
      },
      tokenOut: {
        symbol: "USDT",
        amount: "500000.317382",
      },
    });
  });
});

describe("transformERC20 with erc20 input asset", () => {
  it("parses swap for transformERC20", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x4db5b7168686cdfb1469b47a67f03fb6199aa81f3d2a26c4a05835b8752d152d",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "USDT",
        amount: "275",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      tokenOut: {
        symbol: "MUTE",
        amount: "183.067612917791449241",
        address: "0xA49d7499271aE71cd8aB9Ac515e6694C755d400c",
      },
    });
  });
});
