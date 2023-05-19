import { it, expect } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0x070cbb43e497e24a0574d56d5414c25a13e323a7dbe74c7e3b0890bbf4335b6e",
  blockNumber: 16880528,
  contractAddress: null,
  cumulativeGasUsed: "1251786",
  from: "0xc65f45c3Ac07C57C566341811234c8aA5AfBbb40",
  gasPrice: "16244714645",
  gasUsed: "100333",
  hash: "0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b",
  index: 22,
  logs: [
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0x070cbb43e497e24a0574d56d5414c25a13e323a7dbe74c7e3b0890bbf4335b6e",
      blockNumber: 16880528,
      data: "0x0000000000000000000000000000000000000000000000003663856e9aada400",
      index: 29,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000086d9dc0fc8bc5ad48373eeefaff4826a081db114",
        "0x000000000000000000000000af0b0000f0210d0f421f0009c72406703b50506b",
      ],
      transactionHash:
        "0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b",
      transactionIndex: 22,
    },
    {
      _type: "log",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      blockHash:
        "0x070cbb43e497e24a0574d56d5414c25a13e323a7dbe74c7e3b0890bbf4335b6e",
      blockNumber: 16880528,
      data: "0x00000000000000000000000000000000000000000000000000000000017d7840",
      index: 30,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000af0b0000f0210d0f421f0009c72406703b50506b",
        "0x00000000000000000000000086d9dc0fc8bc5ad48373eeefaff4826a081db114",
      ],
      transactionHash:
        "0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b",
      transactionIndex: 22,
    },
    {
      _type: "log",
      address: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
      blockHash:
        "0x070cbb43e497e24a0574d56d5414c25a13e323a7dbe74c7e3b0890bbf4335b6e",
      blockNumber: 16880528,
      data: "0x05aca59966acd2f559b9dabda84351c49b1ec74d78a42f274680b96a59fcdfa7000000000000000000000000af0b0000f0210d0f421f0009c72406703b50506b00000000000000000000000086d9dc0fc8bc5ad48373eeefaff4826a081db1140000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000017d78400000000000000000000000000000000000000000000000003663856e9aada400",
      index: 31,
      topics: [
        "0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f",
      ],
      transactionHash:
        "0x7f31ba7cacfda809ea24d4b9f87c44fb4114608666c7dd1c6553986ce88dc92b",
      transactionIndex: 22,
    },
  ],
  logsBloom:
    "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000080000000000000200000000000000004000000000000008000000000000000040000000000000000000000000000000000000000000000000000400020000000000000000000010000000000000000000400040000000000000000000000000000000000000000000000000018000000000000000000000000000000000000020000000000000000000004001000002000000000000000000008000000000000000000000000000000000000000300000000000000000000000000000200000000000000000000000000000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for fillTakerSignedOtcOrder", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: {
      name: "fillTakerSignedOtcOrder",
      value: 0n,
      args: [
        [
          "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          25000000n,
          3919122810830431232n,
          "0xAF0B0000f0210D0f421F0009C72406703B50506B",
          "0x86D9Dc0fc8BC5aD48373eEefAFF4826a081DB114",
        ],
      ],
    },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "3.919122810830431232",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    tokenOut: {
      symbol: "WBTC",
      amount: "0.25",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
  });
});
