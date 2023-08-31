import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi"

const BSC_RPC = "https://bsc-dataseed.binance.org";

// https://bscscan.com/tx/0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94
describe("sellToPancakeSwap tx: 0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94", () => {
  it("parses swap from sellToPancakeSwap", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: BSC_RPC,
      transactionHash:
        "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "BUSD",
        amount: "1155.41",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      },
      tokenOut: {
        symbol: "WBNB",
        amount: "1.82210243305633351",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      },
    });
  });
});

// https://bscscan.com/tx/0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b
describe("sellToPancakeSwap tx: 0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b", () => {
  it("parses swap from sellToPancakeSwap", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: BSC_RPC,
      transactionHash:
        "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "WBNB",
        amount: "1.2",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      },
      tokenOut: {
        symbol: "BUSD",
        amount: "319.903586514927545022",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      },
    });
  });
});
