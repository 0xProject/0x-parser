import { expect, it } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff
it("parses swap from sellEthForTokenToUniswapV3", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: ETH_MAINNET_RPC,
    transactionHash: '0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff',
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: NATIVE_ASSET.symbol,
      amount: "2.749441612813630418",
      address: NATIVE_ASSET.address,
    },
    tokenOut: {
      symbol: "HEX",
      amount: "50249.93952297",
      address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
    },
  });
});
