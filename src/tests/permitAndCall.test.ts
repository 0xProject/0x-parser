import { expect, it } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0xbab6ac1d578990ee04c4da7c74fd25b749e8963abea3a340db558da72fdf32af",
  blockNumber: 17289469,
  contractAddress: null,
  cumulativeGasUsed: "3461948",
  from: "0xac844837a2B58db4B4deF35b243ee14c3e36A96b",
  gasPrice: "41539807233",
  gasUsed: "187372",
  hash: "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
  index: 40,
  logs: [
    {
      _type: "log",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      blockHash:
        "0xbab6ac1d578990ee04c4da7c74fd25b749e8963abea3a340db558da72fdf32af",
      blockNumber: 17289469,
      data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      index: 115,
      topics: [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x0000000000000000000000008a6bfcae15e729fd1440574108437dea281a9b3e",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
      transactionIndex: 40,
    },
    {
      _type: "log",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      blockHash:
        "0xbab6ac1d578990ee04c4da7c74fd25b749e8963abea3a340db558da72fdf32af",
      blockNumber: 17289469,
      data: "0x0000000000000000000000000000000000000000000000000000000001312d00",
      index: 116,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000008a6bfcae15e729fd1440574108437dea281a9b3e",
        "0x0000000000000000000000002008b6c3d07b061a84f790c035c2f6dc11a0be70",
      ],
      transactionHash:
        "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
      transactionIndex: 40,
    },
    {
      _type: "log",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      blockHash:
        "0xbab6ac1d578990ee04c4da7c74fd25b749e8963abea3a340db558da72fdf32af",
      blockNumber: 17289469,
      data: "0x00000000000000000000000000000000000000000000000000000000008549c8",
      index: 117,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000002008b6c3d07b061a84f790c035c2f6dc11a0be70",
        "0x0000000000000000000000008a6bfcae15e729fd1440574108437dea281a9b3e",
      ],
      transactionHash:
        "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
      transactionIndex: 40,
    },
    {
      _type: "log",
      address: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
      blockHash:
        "0xbab6ac1d578990ee04c4da7c74fd25b749e8963abea3a340db558da72fdf32af",
      blockNumber: 17289469,
      data: "0x8eb8065d50eb9a19232814290678b5f0a19368dab7ebfe744e0bb9f804fbdd860000000000000000000000002008b6c3d07b061a84f790c035c2f6dc11a0be700000000000000000000000008a6bfcae15e729fd1440574108437dea281a9b3e000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000008549c80000000000000000000000000000000000000000000000000000000001312d00",
      index: 118,
      topics: [
        "0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f",
      ],
      transactionHash:
        "0x5eac379185f24ddeba7fcd4414779df77ecfd1102da6ebf6dacf25b01a14b241",
      transactionIndex: 40,
    },
  ],
  logsBloom:
    "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000200200000000000000000002008000008000000000000000000000000000000000000000000000000000000000000000000000440020000000000000000000010000000000000000000000000800000000000000000000000010000000000000000100000028000000000200000004080000000000000000000000000000000200000004001000002000000000000000000008000000080000000000000008000000000000010000000000000400000000000000000000000000000000000000000000000",
  status: 1,
  to: "0x1291C02D288de3De7dC25353459489073D11E1Ae",
};

it("parses swap from permitAndCall", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: {
      name: "permitAndCall",
      value: 0n,
      args: [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0x8a6BFCae15E729fd1440574108437dEa281A9B3e",
      ],
    },
    rpcUrl: RPC_TEST_URL,
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
