import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x00b191d47269265cfbbc94c77a114281ee939463b7a922e8bfbf7de8bc150c5c
it("parses swap from multiplexMultiHopSellEthForToken", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash: "0x00b191d47269265cfbbc94c77a114281ee939463b7a922e8bfbf7de8bc150c5c",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: NATIVE_ASSET.symbol,
      amount: "3",
      address: NATIVE_ASSET.address,
    },
    tokenOut: {
      symbol: "XCAD",
      amount: "2705.968001258040126473",
      address: "0x7659CE147D0e714454073a5dd7003544234b6Aa0",
    },
  });
});
