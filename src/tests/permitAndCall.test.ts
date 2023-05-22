import { expect, it } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241
it("parses swap from permitAndCall", async () => {
  const data = await parseSwap({
    transactionHash: "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",    
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "20",
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    tokenOut: {
      symbol: "USDT",
      amount: "8.735176",
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
  });
});
