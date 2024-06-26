import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

const BSC_RPC = "https://bsc-dataseed.binance.org";

// https://bscscan.com/tx/0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94
describe("sellToPancakeSwap", () => {
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

  // https://bscscan.com/tx/0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b
  it("parses another swap from sellToPancakeSwap", async () => {
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

  // https://bscscan.com/tx/0x0f95c3d8429b498a28ee194082e7394b63a595e0b9bd96b14c4895f1bd80cd9b
  it("parses swap from sellToPancakeSwap with transfer events that transfer zero amounts", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: BSC_RPC,
      transactionHash:
        "0x0f95c3d8429b498a28ee194082e7394b63a595e0b9bd96b14c4895f1bd80cd9b",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "WBNB",
        amount: "1.599214125294091218",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      },
      tokenOut: {
        symbol: "HELLO",
        amount: "7022.195837990335108707",
        address: "0x0F1cBEd8EFa0E012AdbCCB1638D0aB0147D5Ac00",
      },
    });
  });

  // https://bscscan.com/tx/0xba7e86dd27ba9b14cca0c98edc5df9c753ec8ae27ace3bacb80e87cbde33f850
  it("parses swap from sellToPancakeSwap with transfer events that transfer output amount to exchange proxy", async () => {
    const data = await parseSwap({
      exchangeProxyAbi,
      rpcUrl: BSC_RPC,
      transactionHash:
        "0xba7e86dd27ba9b14cca0c98edc5df9c753ec8ae27ace3bacb80e87cbde33f850",
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "IDIA",
        amount: "50",
        address: "0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89",
      },
      tokenOut: {
        symbol: "WBNB",
        amount: "0.011285266969864419",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      },
    });
  });
});
