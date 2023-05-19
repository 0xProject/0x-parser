import { it, expect } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0x7979e3b04a458bbaa17530c78243887f3d987f500fc2c9e43151f9ac2a018d95",
  blockNumber: 16788305,
  contractAddress: null,
  cumulativeGasUsed: "10895112",
  from: "0xaeDC687fa5376d2Fe9D4B81EbFC8C2bA30ba54aE",
  gasPrice: "33567480136",
  gasUsed: "123918",
  hash: "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
  index: 121,
  logs: [
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0x7979e3b04a458bbaa17530c78243887f3d987f500fc2c9e43151f9ac2a018d95",
      blockNumber: 16788305,
      data: "0x0000000000000000000000000000000000000000000000000c7d713b49da0000",
      index: 286,
      topics: [
        "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
      transactionIndex: 121,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0x7979e3b04a458bbaa17530c78243887f3d987f500fc2c9e43151f9ac2a018d95",
      blockNumber: 16788305,
      data: "0x0000000000000000000000000000000000000000000000000c7d713b49da0000",
      index: 287,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000945bcf562085de2d5875b9e2012ed5fd5cfab927",
      ],
      transactionHash:
        "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
      transactionIndex: 121,
    },
    {
      _type: "log",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      blockHash:
        "0x7979e3b04a458bbaa17530c78243887f3d987f500fc2c9e43151f9ac2a018d95",
      blockNumber: 16788305,
      data: "0x00000000000000000000000000000000000000000000000000000000527f4c9c",
      index: 288,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000945bcf562085de2d5875b9e2012ed5fd5cfab927",
        "0x000000000000000000000000aedc687fa5376d2fe9d4b81ebfc8c2ba30ba54ae",
      ],
      transactionHash:
        "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
      transactionIndex: 121,
    },
    {
      _type: "log",
      address: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
      blockHash:
        "0x7979e3b04a458bbaa17530c78243887f3d987f500fc2c9e43151f9ac2a018d95",
      blockNumber: 16788305,
      data: "0x91c4c83dd090378cc5f34beab9c2ddf312564ba88c8e6fcc21f0d571c84a1eb3000000000000000000000000945bcf562085de2d5875b9e2012ed5fd5cfab927000000000000000000000000aedc687fa5376d2fe9d4b81ebfc8c2ba30ba54ae000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000527f4c9c0000000000000000000000000000000000000000000000000c7d713b49da0000",
      index: 289,
      topics: [
        "0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f",
      ],
      transactionHash:
        "0x68608bec5c30750a6a358b14eb937a07f10f72c84428bdf6eae80f52c27faf53",
      transactionIndex: 121,
    },
  ],
  logsBloom:
    "0x00010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000080000000000000202000000000000000000002008000008000000000000200000000040000000008000000000000000000000000000000000000440000000000000000000000010000000000000000000000000000000000000000000000001010000000000000000000000008000000000200000004000000000000000000000000000000000000000004001000002000000000000000000008000000000000000000000000000000000000000200000000020000000000000000000000100000000400000000000000000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for fillOtcOrderWithEth", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: {
      name: "fillOtcOrderWithEth",
      value: 0n,
      args: [
        [
          "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        ],
      ],
    },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "0.9",
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    tokenOut: {
      symbol: "USDC",
      amount: "1384.074396",
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
  });
});
