import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_ASSET } from "../constants";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b
describe("parseSwap", () => {
  it("parses swap from sellTokenForEthToUniswapV3", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "✺RUG",
        amount: "56322.215316673764925169",
        address: "0xD2d8D78087D0E43BC4804B6F946674b2Ee406b80",
      },
      tokenOut: {
        symbol: NATIVE_ASSET.symbol,
        amount: "0.218304893918707078",
        address: NATIVE_ASSET.address,
      },
    });
  });

  it("parses swap from sellTokenForEthToUniswapV3", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: ETH_MAINNET_RPC,
      transactionHash:
        "0xf6271c6ae709c31b2679f9190798bc64e636feb8b49d498e6239f171783884df",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "ETHFI",
        amount: "609.2",
        address: "0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB",
      },
      tokenOut: {
        symbol: NATIVE_ASSET.symbol,
        amount: "0.519590258364550926",
        address: NATIVE_ASSET.address,
      },
    });
  });
});
