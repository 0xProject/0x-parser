import { expect, it } from "vitest";
import { parseSwap } from "../index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff
const txReceipt = {
  _type: "TransactionReceipt",
  blockHash:
    "0xc00feb5cf505e3fda66e10d321ace5899ec3c9f5102c44472e1e78a83a5ab48a",
  blockNumber: 16880872,
  contractAddress: null,
  cumulativeGasUsed: "18839294",
  from: "0x43fB70A5474442514E740978C486f583DaFE78Ff",
  gasPrice: "12441332320",
  gasUsed: "116970",
  hash: "0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff",
  index: 133,
  logs: [
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xc00feb5cf505e3fda66e10d321ace5899ec3c9f5102c44472e1e78a83a5ab48a",
      blockNumber: 16880872,
      data: "0x0000000000000000000000000000000000000000000000002627fa94666efbd2",
      index: 218,
      topics: [
        "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
      ],
      transactionHash:
        "0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff",
      transactionIndex: 133,
    },
    {
      _type: "log",
      address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
      blockHash:
        "0xc00feb5cf505e3fda66e10d321ace5899ec3c9f5102c44472e1e78a83a5ab48a",
      blockNumber: 16880872,
      data: "0x00000000000000000000000000000000000000000000000000000491f8fac229",
      index: 219,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000009e0905249ceefffb9605e034b534544684a58be6",
        "0x00000000000000000000000043fb70a5474442514e740978c486f583dafe78ff",
      ],
      transactionHash:
        "0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff",
      transactionIndex: 133,
    },
    {
      _type: "log",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      blockHash:
        "0xc00feb5cf505e3fda66e10d321ace5899ec3c9f5102c44472e1e78a83a5ab48a",
      blockNumber: 16880872,
      data: "0x0000000000000000000000000000000000000000000000002627fa94666efbd2",
      index: 220,
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x0000000000000000000000009e0905249ceefffb9605e034b534544684a58be6",
      ],
      transactionHash:
        "0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff",
      transactionIndex: 133,
    },
    {
      _type: "log",
      address: "0x9e0905249CeEFfFB9605E034b534544684A58BE6",
      blockHash:
        "0xc00feb5cf505e3fda66e10d321ace5899ec3c9f5102c44472e1e78a83a5ab48a",
      blockNumber: 16880872,
      data: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffb6e07053dd70000000000000000000000000000000000000000000000002627fa94666efbd200000000000000000000000000000000000002e2ad51d21806741c07ae23d95a000000000000000000000000000000000000000000000000d4e3cc1522e228b30000000000000000000000000000000000000000000000000000000000020407",
      index: 221,
      topics: [
        "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
        "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        "0x00000000000000000000000043fb70a5474442514e740978c486f583dafe78ff",
      ],
      transactionHash:
        "0xc552e83ef96c5d523f69494ae61b7235a6304ab439e127eb0121d33bbcdaa1ff",
      transactionIndex: 133,
    },
  ],
  logsBloom:
    "0x00000004000000000000080000000000000000000000000000000000000000000000000000000000000000000000000002000000080020000000000000000000000000000000002800000028000000000000000000000000000100008000000000000000000000000000000000000040000000000000000000000010000800000000000000000000000000000000000000000001000000000000010000000000000000000000002000004000000000000000000020020000000000000200000000080002000000000000000000000000000000000000000000000000000000001000200000000000000000000000400000000000000000400000000000000000",
  status: 1,
  to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
};

it("parses swap for sellEthForTokenToUniswapV3", async () => {
  const data = await parseSwap({
    txReceipt,
    txDescription: { name: "sellEthForTokenToUniswapV3", value: 0n, args: [] },
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "2.749441612813630418",
    },
    tokenOut: {
      symbol: "HEX",
      amount: "50249.93952297",
    },
  });
});
