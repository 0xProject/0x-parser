import { it, expect, describe } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("fillOtcOrder", () => {
  // https://etherscan.io/tx/0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb
  it("parse a swap on Ethereum", async () => {
    const data = await parseSwap({
      transactionHash:
        "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "USDT",
        amount: "50000",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      tokenOut: {
        symbol: "LDO",
        amount: "21120.508370504671821824",
        address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
      },
    });
  });

  // https://arbiscan.io/tx/0x3e48c1d1d3596ecfc1f9feb9e9613f5f5fc002b76743251c31eca8bc0aa30e21
  it("parse a swap on Arbitrum", async () => {
    const data = await parseSwap({
      transactionHash:
        "0xae78f94319844585bd9e8d4ecfefa2eb70e0cd0d49f76695ee7e4783bad4c1fc",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: "https://arb1.arbitrum.io/rpc",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "ARB",
        amount: "2050",
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      },
      tokenOut: {
        symbol: "USDC",
        amount: "1918.218706",
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      },
    });
  });
});
