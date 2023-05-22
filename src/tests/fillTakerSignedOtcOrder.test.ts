import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b
it("parses swap for fillTakerSignedOtcOrder", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "3.919122810830431232",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      symbol: "WBTC",
      amount: "0.25",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
  });
});
