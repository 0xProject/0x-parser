import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xba3a89b2164e5f169bc81e90a13f8946d110dffe2b53393953ea2a4fede8e81e
it("parses swap from multiplexMultiHopSellTokenForEth", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xba3a89b2164e5f169bc81e90a13f8946d110dffe2b53393953ea2a4fede8e81e",
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "LSS",
      amount: "20065.979484072366300492",
      address: "0x3B9BE07d622aCcAEd78f479BC0EDabFd6397E320",
    },
    tokenOut: {
      symbol: NATIVE_ASSET.symbol,
      amount: "3.305750792360646949",
      address: NATIVE_ASSET.address,
    },
  });
});
