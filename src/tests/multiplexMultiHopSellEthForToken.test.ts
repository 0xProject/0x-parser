import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x00b191d47269265cfbbc94c77a114281ee939463b7a922e8bfbf7de8bc150c5c
it("parses swap for multiplexMultiHopSellEthForToken", async () => {
  const data = await parseSwap({
    transactionHash: "0x00b191d47269265cfbbc94c77a114281ee939463b7a922e8bfbf7de8bc150c5c",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "3",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      symbol: "XCAD",
      amount: "2705.968001258040126473",
      address: "0x7659CE147D0e714454073a5dd7003544234b6Aa0",
    },
  });
});
