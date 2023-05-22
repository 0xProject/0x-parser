import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63
it("parses swap for multiplexBatchSellTokenForEth", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "BORING",
      amount: "181533.55587344",
      address: "0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.48027902546177326",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});
