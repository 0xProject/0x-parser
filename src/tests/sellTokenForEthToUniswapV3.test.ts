import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
  blockNumber: 16895393,
  contractAddress: null,
  cumulativeGasUsed: "3133567",
  from: "0x745ecE084d3e1868E97Fcd577106Fc5adb7b3800",
  gasPrice: "16235667631",
  gasUsed: "172294",
  hash: "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
  index: 36,
  logs: [
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
      blockNumber: 16895393,
      data: "0x00000000000000000000000000000000000000000000000003079324f6c0fd86",
      index: 67,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000075f4849d3c2088e5599cecf6ee0fdf8addfd124",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
      transactionIndex: 36,
    },
    {
      _type: "log",
      address: "0xD2d8D78087D0E43BC4804B6F946674b2Ee406b80",
      blockHash:
        "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
      blockNumber: 16895393,
      data: "0x000000000000000000000000000000000000000000000bed3bc0c6a0fcc21ef1",
      index: 68,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000745ece084d3e1868e97fcd577106fc5adb7b3800",
        "0x000000000000000000000000075f4849d3c2088e5599cecf6ee0fdf8addfd124",
      ],
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
      transactionIndex: 36,
    },
    {
      _type: "log",
      address: "0xD2d8D78087D0E43BC4804B6F946674b2Ee406b80",
      blockHash:
        "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
      blockNumber: 16895393,
      data: "0x",
      index: 69,
      topics: [
        "0x81df7148ed3a9aa51bafe04f44371e89b96f47294267fbf6ab28b7aa8c87b386",
        "0x000000000000000000000000745ece084d3e1868e97fcd577106fc5adb7b3800",
      ],
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
      transactionIndex: 36,
    },
    {
      _type: "log",
      address: "0xD2d8D78087D0E43BC4804B6F946674b2Ee406b80",
      blockHash:
        "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
      blockNumber: 16895393,
      data: "0xfffffffffffffffffffffffffffffffffffffffffffff412c43f395f033de10e",
      index: 70,
      topics: [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x000000000000000000000000745ece084d3e1868e97fcd577106fc5adb7b3800",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
      transactionIndex: 36,
    },
    {
      _type: "log",
      address: "0x075F4849d3C2088E5599ceCf6Ee0fdF8AddFD124",
      blockHash:
        "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
      blockNumber: 16895393,
      data: "0xfffffffffffffffffffffffffffffffffffffffffffffffffcf86cdb093f027a000000000000000000000000000000000000000000000bed3bc0c6a0fcc21ef100000000000000000000000000000000000005e770e2e952e60501eb291004d500000000000000000000000000000000000000000000000228a1eb196d2dcefa0000000000000000000000000000000000000000000000000000000000023bf7",
      index: 71,
      topics: [
        "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
      transactionIndex: 36,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0x192fc9848b48515f31c8f440e11cc45c84828ee9bb112b17d4737915174c6b99",
      blockNumber: 16895393,
      data: "0x00000000000000000000000000000000000000000000000003079324f6c0fd86",
      index: 72,
      topics: [
        "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x822d38c0746b19544cedddd9a1ebaacadd3e5da55dc293738ae135fc595e269b",
      transactionIndex: 36,
    },
  ],
  logsBloom:
    "0x00000000000000100000000000000000000000000000000000000000001000000000000000000000000000000000000002000000080020000000000000200000080000000000002800000008000000080000000000400000000000000000000000000040000000000000000000000040000000000000040000000010000800000000000000000004000000000000000000000000000000000000000000000000020000008000000000004000000000000000000000000000000000000000000000000002000000000008000000000000000000000000000000000802000000000218200000000000800000000000000000000000020000000000000000000001",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

describe("parseSwap", () => {
  it("parses swap for sellTokenForEthToUniswapV3", async () => {
    const data = await parseSwap({
      txReceipt,
      txDescription: {
        name: "sellTokenForEthToUniswapV3",
        value: 0n,
        args: [],
      },
      rpcUrl: RPC_TEST_URL,
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
