import { it, expect } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
  blockNumber: 16877328,
  contractAddress: null,
  cumulativeGasUsed: "772926",
  from: "0xcb171D302503461C189d0846F4DfF1f5597a1910",
  gasPrice: "27947314911",
  gasUsed: "290684",
  hash: "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
  index: 1,
  logs: [
    {
      _type: "log",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x0000000000000000000000000000000000000000000000000000000006e3d048",
      index: 9,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000099ac8ca7087fa4a2a1fb6357269965a2014abc35",
        "0x000000000000000000000000cb171d302503461c189d0846f4dff1f5597a1910",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x00000000000000000000000000000000000000000000000000000007ace8778f",
      index: 10,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000cb171d302503461c189d0846f4dff1f5597a1910",
        "0x00000000000000000000000099ac8ca7087fa4a2a1fb6357269965a2014abc35",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0x99ac8cA7087fA4A2A1FB6357269965A2014ABc35",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffff91c2fb800000000000000000000000000000000000000000000000000000007ace8778f0000000000000000000000000000000000000010de0e508cd99ab2c3b5b03e4e000000000000000000000000000000000000000000000000000002d4d028e8ba000000000000000000000000000000000000000000000000000000000000dcbe",
      index: 11,
      topics: [
        "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000cb171d302503461c189d0846f4dff1f5597a1910",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x000000000000000000000000000000000000000000000008d37aa185e83bcb14",
      index: 12,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x00000000000000000000000000000000000000000000000000000045142c33ff",
      index: 13,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000cb171d302503461c189d0846f4dff1f5597a1910",
        "0x00000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x00000000000000000000000000000000000000000000000000000045142c33fffffffffffffffffffffffffffffffffffffffffffffffff72c855e7a17c434ec0000000000000000000000000000000000005b876e989ebde8490d035730ea620000000000000000000000000000000000000000000000371f0e418bdd2c120d000000000000000000000000000000000000000000000000000000000003121e",
      index: 14,
      topics: [
        "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x000000000000000000000000000000000000000000000000000000003dfe995e",
      index: 15,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000004585fe77225b41b697c938b018e2ac67ac5a20c0",
        "0x000000000000000000000000cb171d302503461c189d0846f4dff1f5597a1910",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0x000000000000000000000000000000000000000000000008d37aa185e83bcb14",
      index: 16,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x0000000000000000000000004585fe77225b41b697c938b018e2ac67ac5a20c0",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
    {
      _type: "log",
      address: "0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0",
      blockHash:
        "0xfbf9da6e5b4d86634bfbc7ec2e9fa199792ea4efd1c4ab34e62fbc35fa6595cd",
      blockNumber: 16877328,
      data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffc20166a2000000000000000000000000000000000000000000000008d37aa185e83bcb140000000000000000000000000000000000060958afa8c1b3d054281a98961abb00000000000000000000000000000000000000000000000012806b4a0e1c5397000000000000000000000000000000000000000000000000000000000003eef0",
      index: 17,
      topics: [
        "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x000000000000000000000000cb171d302503461c189d0846f4dff1f5597a1910",
      ],
      transactionHash:
        "0xb2c5a697a3126af96d2aa20ba6dcd0daaf9ec6baa49de2a76682dfe4258d2e56",
      transactionIndex: 1,
    },
  ],
  logsBloom:
    "0x00000000010100000000000000000000000001080000000000000000040000000000000000100000000008000000000002000000080020000000000000000000000000000000002808000208000000000000000000000000000000000000000000080000000002000000080000400040020000000000000000000010000800000020000000000000000000000000000000000000010000000000000000000000010008000000200000004000000000800020000000000000002000000008000000000002000000000000080000000000000000000200000000000000000000000000200000000000000010000000000000200000000000000000000000000000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for multiplexBatchSellTokenForToken", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: {
      name: "multiplexBatchSellTokenForToken",
      value: 0n,
      args: [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      ],
    },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      amount: "329656.871822",
      symbol: "USDC",
    },
    tokenOut: {
      amount: "11.5568887",
      symbol: "WBTC",
    },
  });
});
