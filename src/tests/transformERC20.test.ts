import { Contract } from "ethers";
import { it, expect, describe } from "vitest";
import { parseSwap } from "../index";
import { CONTRACTS } from "../constants";
import { transformERC20 } from "../parsers";
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
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        symbol: "ETH",
        amount: "332.666067836453233036",
      },
      tokenOut: {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
        amount: "500000.317382",
      },
    });
  });
});

describe("transformERC20 with erc20 input asset", () => {
  // https://etherscan.io/tx/0x4db5b7168686cdfb1469b47a67f03fb6199aa81f3d2a26c4a05835b8752d152d
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
        amount: "275.0",
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

describe("transformERC20", () => {
  it("returns undefined when TransformedERC20 topic is not found in logs", async () => {
    const contract = new Contract(
      CONTRACTS.exchangeProxy.ethereum,
      EXCHANGE_PROXY_ABI.compilerOutput.abi
    );

    const transactionReceipt = {
      from: "0x8C410057a8933d579926dEcCD043921A974A24ee",
      hash: "0xee3ffb65f6c8e07b46471cc610cf721affeefed87098c7db30a8147d50eb2a65",
      logs: [],
      to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
    };

    const result = await transformERC20({
      transactionReceipt,
      contract,
      rpcUrl: ETH_MAINNET_RPC,
    } as any);

    expect(result).toBe(undefined);
  });
});
