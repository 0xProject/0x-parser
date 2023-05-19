import { it, expect } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0xc3f1b620ee5300ea7acac1b6ddaa377616aadc6949f5103e78fee5a728f0119c",
  blockNumber: 16887703,
  contractAddress: null,
  cumulativeGasUsed: "1440675",
  from: "0x5Ef3D4F41791f0B9f1CEe6D739d77748f81FCa3A",
  gasPrice: "14945943523",
  gasUsed: "108287",
  hash: "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
  index: 9,
  logs: [
    {
      _type: "log",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      blockHash:
        "0xc3f1b620ee5300ea7acac1b6ddaa377616aadc6949f5103e78fee5a728f0119c",
      blockNumber: 16887703,
      data: "0x000000000000000000000000000000000000000000000000000000000d0526a0",
      index: 56,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000005ef3d4f41791f0b9f1cee6d739d77748f81fca3a",
        "0x000000000000000000000000945bcf562085de2d5875b9e2012ed5fd5cfab927",
      ],
      transactionHash:
        "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
      transactionIndex: 9,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xc3f1b620ee5300ea7acac1b6ddaa377616aadc6949f5103e78fee5a728f0119c",
      blockNumber: 16887703,
      data: "0x00000000000000000000000000000000000000000000000001bda6f1d0fa2e18",
      index: 57,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000945bcf562085de2d5875b9e2012ed5fd5cfab927",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
      transactionIndex: 9,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xc3f1b620ee5300ea7acac1b6ddaa377616aadc6949f5103e78fee5a728f0119c",
      blockNumber: 16887703,
      data: "0x00000000000000000000000000000000000000000000000001bda6f1d0fa2e18",
      index: 58,
      topics: [
        "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
      transactionIndex: 9,
    },
    {
      _type: "log",
      address: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
      blockHash:
        "0xc3f1b620ee5300ea7acac1b6ddaa377616aadc6949f5103e78fee5a728f0119c",
      blockNumber: 16887703,
      data: "0xdc6e2ed72927795b58577a1792e88664b554696382148c1901046689ffe9b54c000000000000000000000000945bcf562085de2d5875b9e2012ed5fd5cfab9270000000000000000000000005ef3d4f41791f0b9f1cee6d739d77748f81fca3a000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000000000000000000000000000001bda6f1d0fa2e18000000000000000000000000000000000000000000000000000000000d0526a0",
      index: 59,
      topics: [
        "0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f",
      ],
      transactionHash:
        "0x2c4cee137659650ef486fb46b657ec37c1b4fe18489956a5e058cf5585328fa7",
      transactionIndex: 9,
    },
  ],
  logsBloom:
    "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010002000000080000000000000200000000000000000000002000000008000000000000200000400040000100000000000000000000000000000000000000000440000000000000040000000010000000000000000000000000000000000000000000000000000000000000000000100000008000000000000000014080000000000000000000000000000000000000004001000002000000000000000000008000000000000000000000000002000000000000200000000020000000000000000000000800000000000000000000000000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for fillOtcOrderForEth", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: {
      name: "fillOtcOrderForEth",
      value: 0n,
      args: [
        [
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          125439922159627800n,
          218441376n,
        ],
      ],
    },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "218.441376",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.1254399221596278",
    },
  });
});
