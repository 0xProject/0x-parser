import { it, expect } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0x978b109abda1469e3e6e1a5fd7f522f8482abb25c8627de1af5acd0af721de87",
  blockNumber: 16880870,
  contractAddress: null,
  cumulativeGasUsed: "9377472",
  from: "0x055B29979f6BC27669Ebd54182588FeF12ffBFc0",
  gasPrice: "11664655136",
  gasUsed: "194083",
  hash: "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
  index: 88,
  logs: [
    {
      _type: "log",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      blockHash:
        "0x978b109abda1469e3e6e1a5fd7f522f8482abb25c8627de1af5acd0af721de87",
      blockNumber: 16880870,
      data: "0x0000000000000000000000000000000000000000000000000000000ba43b7400",
      index: 247,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000055b29979f6bc27669ebd54182588fef12ffbfc0",
        "0x000000000000000000000000bb289bc97591f70d8216462df40ed713011b968a",
      ],
      transactionHash:
        "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
      transactionIndex: 88,
    },
    {
      _type: "log",
      address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
      blockHash:
        "0x978b109abda1469e3e6e1a5fd7f522f8482abb25c8627de1af5acd0af721de87",
      blockNumber: 16880870,
      data: "0x000000000000000000000000000000000000000000000478f1eefdb98b400000",
      index: 248,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000bb289bc97591f70d8216462df40ed713011b968a",
        "0x000000000000000000000000055b29979f6bc27669ebd54182588fef12ffbfc0",
      ],
      transactionHash:
        "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
      transactionIndex: 88,
    },
    {
      _type: "log",
      address: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
      blockHash:
        "0x978b109abda1469e3e6e1a5fd7f522f8482abb25c8627de1af5acd0af721de87",
      blockNumber: 16880870,
      data: "0x3e1ae2d0a141e6ca72069c001e1371c4d4c52219fd8cb74f4d5cddef128d4d29000000000000000000000000bb289bc97591f70d8216462df40ed713011b968a000000000000000000000000055b29979f6bc27669ebd54182588fef12ffbfc00000000000000000000000005a98fcbea516cf06857215779fd812ca3bef1b32000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000478f1eefdb98b4000000000000000000000000000000000000000000000000000000000000ba43b7400",
      index: 249,
      topics: [
        "0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f",
      ],
      transactionHash:
        "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
      transactionIndex: 88,
    },
  ],
  logsBloom:
    "0x00000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000010000000000000000000000000200000000000000000000000010000008000000040000000000000000000000000000000001000000000000000000000000000400000000000000000000000010000000000000000000000000000400000000000000000000000000000000002000100000008000000000000000000080000000000000004004000000000000000000004001000002000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for fillOtcOrder", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: { name: "fillOtcOrder", value: 0n, args: [] },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "50000",
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    tokenOut: {
      symbol: "LDO",
      amount: "21120.508370504671821824",
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
    },
  });
});
