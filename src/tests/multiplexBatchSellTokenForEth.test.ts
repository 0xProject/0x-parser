import { it, expect } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
  blockNumber: 16594643,
  contractAddress: null,
  cumulativeGasUsed: "11198938",
  from: "0x30c5312d9CF0d873994f000e72F1cbf561D0209C",
  gasPrice: "34042615780",
  gasUsed: "212166",
  hash: "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
  index: 114,
  logs: [
    {
      _type: "log",
      address: "0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x0000000000000000000000000000000000000000000011bdfa8a0d55e15ae277",
      index: 266,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000030c5312d9cf0d873994f000e72f1cbf561d0209c",
        "0x0000000000000000000000008d9f34af8d66ab7a84ce1241426510dfecea868f",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0xfffffffffffffffffffffffffffffffffffffffffff79baef5b00b82054e6588",
      index: 267,
      topics: [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x00000000000000000000000030c5312d9cf0d873994f000e72f1cbf561d0209c",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x0000000000000000000000000000000000000000000000000313b8257b2d3755",
      index: 268,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000008d9f34af8d66ab7a84ce1241426510dfecea868f",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0x8d9F34af8d66AB7a84cE1241426510DFECEa868F",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x00000000000000000000000000000000000000000002976626dea005d14382b40000000000000000000000000000000000000000000000007050543a7ec349b8",
      index: 269,
      topics: [
        "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0x8d9F34af8d66AB7a84cE1241426510DFECEa868F",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x0000000000000000000000000000000000000000000011bdfa8a0d55e15ae277000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000313b8257b2d3755",
      index: 270,
      topics: [
        "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x00000000000000000000000000000000000000000000000003969315268b0c62",
      index: 271,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000917c52869df752d784ec73fa0881898f9bfd0fd8",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x0000000000000000000000000000000000000000000014b2f9a10f8edc3f5d89",
      index: 272,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000030c5312d9cf0d873994f000e72f1cbf561d0209c",
        "0x000000000000000000000000917c52869df752d784ec73fa0881898f9bfd0fd8",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0xfffffffffffffffffffffffffffffffffffffffffff786fbfc0efbf3290f07ff",
      index: 273,
      topics: [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x00000000000000000000000030c5312d9cf0d873994f000e72f1cbf561d0209c",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0x917C52869df752d784eC73fa0881898f9Bfd0fd8",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x0000000000000000000000000000000000000000000014b2f9a10f8edc3f5d89fffffffffffffffffffffffffffffffffffffffffffffffffc696cead974f39e00000000000000000000000000000000000000000069393c21eaf2a708e00a9800000000000000000000000000000000000000000000012b6a4604b4d5b1e721fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe094c",
      index: 274,
      topics: [
        "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xdbc82caf05c5fed089e4d36ba615e242f2c047b1e16de3ed49f4cdba13303964",
      blockNumber: 16594643,
      data: "0x00000000000000000000000000000000000000000000000006aa4b3aa1b843b7",
      index: 275,
      topics: [
        "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0x0caebae93af96f83c4d2434816d079d1b43e9061dcaca8627bd9e2c0917a3b63",
      transactionIndex: 114,
    },
  ],
  logsBloom:
    "0x00200000000000000000000082020000000000000000000002000000400000000000000000000000000000000000000002000000080020000000000000200000000400000000006800000008000000200000000000400000000000100000000000000000000000000000000000000040000000400000040800000010000800000000000000000000000000000000000000000000008000084000004000000800020000000000000000004000000000000000000000000000000000000000000000000002000000000000000000000000000100000000001000000002000200000010200000000000000000040000000000000002000000000000000000000000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for multiplexBatchSellTokenForEth", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: {
      name: "multiplexBatchSellTokenForEth",
      value: 0n,
      args: [],
    },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "BORING",
      amount: "181533.55587344",
      address: "0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.48027902546177326",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});
