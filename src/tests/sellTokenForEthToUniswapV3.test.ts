import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b
describe("parseSwap", () => {
  it("parses swap for sellTokenForEthToUniswapV3", async () => {
    const data = await parseSwap({
      transactionHash: '0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b',
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "✺RUG",
        amount: "56322.215316673764925169",
        address: '0xD2d8D78087D0E43BC4804B6F946674b2Ee406b80',
      },
      tokenOut: {
        symbol: "WETH",
        amount: "0.218304893918707078",
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      },
    });
  });
});
