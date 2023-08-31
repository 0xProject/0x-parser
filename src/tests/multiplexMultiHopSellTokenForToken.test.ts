import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xf705df9127065ae8a8da3c1939d7096011ea13c81e4a2ed8c59ea1b039f7565d
it("parses swap from multiplexMultiHopSellTokenForToken", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash: "0xf705df9127065ae8a8da3c1939d7096011ea13c81e4a2ed8c59ea1b039f7565d",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "LINK",
      amount: "503.8124966",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    tokenOut: {
      symbol: "DAO",
      amount: "2014.179756573835415392",
      address: "0x0f51bb10119727a7e5eA3538074fb341F56B09Ad",
    },
  });
});
