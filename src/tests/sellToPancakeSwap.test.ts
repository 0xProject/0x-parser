import { describe, expect, it } from "vitest";
import { parseSwap } from "../index";

const RPC_TEST_URL = "https://bscrpc.com";

// https://bscscan.com/tx/0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94
describe("sellToPancakeSwap tx: 0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94", () => {
  const txReceipt = {
    _type: "TransactionReceipt",
    blockHash:
      "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
    blockNumber: 7230932,
    contractAddress: null,
    cumulativeGasUsed: "18442357",
    from: "0x1AAfADAE27d7EBaA2A2D0d91C7231b37502F4517",
    gasPrice: "5000000000",
    gasUsed: "111201",
    hash: "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
    index: 134,
    logs: [
      {
        _type: "log",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        blockHash:
          "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
        blockNumber: 7230932,
        data: "0x00000000000000000000000000000000000000000000003ea288e9601e150000",
        index: 453,
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001aafadae27d7ebaa2a2d0d91c7231b37502f4517",
          "0x0000000000000000000000001b96b92314c44b159149f7e0303511fb2fc4774f",
        ],
        transactionHash:
          "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
        transactionIndex: 134,
      },
      {
        _type: "log",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        blockHash:
          "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
        blockNumber: 7230932,
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffc15d77169fe1eaffff",
        index: 454,
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x0000000000000000000000001aafadae27d7ebaa2a2d0d91c7231b37502f4517",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        ],
        transactionHash:
          "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
        transactionIndex: 134,
      },
      {
        _type: "log",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        blockHash:
          "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
        blockNumber: 7230932,
        data: "0x000000000000000000000000000000000000000000000000194968824ab29ec6",
        index: 455,
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001b96b92314c44b159149f7e0303511fb2fc4774f",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        ],
        transactionHash:
          "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
        transactionIndex: 134,
      },
      {
        _type: "log",
        address: "0x1B96B92314C44b159149f7E0303511fB2Fc4774f",
        blockHash:
          "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
        blockNumber: 7230932,
        data: "0x000000000000000000000000000000000000000000000587e3cf134216392ef50000000000000000000000000000000000000000000da8dc764e3da0b28843fa",
        index: 456,
        topics: [
          "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
        ],
        transactionHash:
          "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
        transactionIndex: 134,
      },
      {
        _type: "log",
        address: "0x1B96B92314C44b159149f7E0303511fB2Fc4774f",
        blockHash:
          "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
        blockNumber: 7230932,
        data: "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003ea288e9601e150000000000000000000000000000000000000000000000000000194968824ab29ec60000000000000000000000000000000000000000000000000000000000000000",
        index: 457,
        topics: [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        ],
        transactionHash:
          "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
        transactionIndex: 134,
      },
      {
        _type: "log",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        blockHash:
          "0x4da8c009c6fe840e9c70d66a3dd866d393f063f954e2be08854023d5c3c32c43",
        blockNumber: 7230932,
        data: "0x000000000000000000000000000000000000000000000000194968824ab29ec6",
        index: 458,
        topics: [
          "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        ],
        transactionHash:
          "0x2076af859a54f5f0c7d4e1cd13b3906169a5e3697d8762b59062052d53466e94",
        transactionIndex: 134,
      },
    ],
    logsBloom:
      "0x00200000000000100000000080000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000002000000008000000200000000000400000000400000000000000000000000000000100000000000040000000000000040000000010000000000000000000000000000000000000000000040000000000080000004000000000020000000000000000004000000000000000000000000000002000000000000000000002000000020000000000001000000100000000001000100002000080000010000004000000000000000020002000000000000000000000000000000000",
    status: 1,
    to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
  };

  it("parses swap for sellToPancakeSwap", async () => {
    const data = await parseSwap({
      txReceipt,
      txDescription: { name: "sellToPancakeSwap", value: 0n, args: [] },
      rpcUrl: RPC_TEST_URL,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "BUSD",
        amount: "1155.41",
      },
      tokenOut: {
        symbol: "WBNB",
        amount: "1.82210243305633351",
      },
    });
  });
});

// https://bscscan.com/tx/0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b
describe("sellToPancakeSwap tx: 0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b", () => {
  const txReceipt = {
    _type: "TransactionReceipt",
    blockHash:
      "0x8dc6404fb09e14956c9d42b8bb0542aa047076aa74815cd40580d0cc2adc9699",
    blockNumber: 5893208,
    contractAddress: null,
    cumulativeGasUsed: "6895623",
    from: "0x2F9c91660986DeCCB0E1AB2A3957e67cf64db29d",
    gasPrice: "10000000000",
    gasUsed: "107764",
    hash: "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
    index: 54,
    logs: [
      {
        _type: "log",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        blockHash:
          "0x8dc6404fb09e14956c9d42b8bb0542aa047076aa74815cd40580d0cc2adc9699",
        blockNumber: 5893208,
        data: "0x00000000000000000000000000000000000000000000000010a741a462780000",
        index: 229,
        topics: [
          "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
        ],
        transactionHash:
          "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
        transactionIndex: 54,
      },
      {
        _type: "log",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        blockHash:
          "0x8dc6404fb09e14956c9d42b8bb0542aa047076aa74815cd40580d0cc2adc9699",
        blockNumber: 5893208,
        data: "0x00000000000000000000000000000000000000000000000010a741a462780000",
        index: 230,
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
          "0x0000000000000000000000001b96b92314c44b159149f7e0303511fb2fc4774f",
        ],
        transactionHash:
          "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
        transactionIndex: 54,
      },
      {
        _type: "log",
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        blockHash:
          "0x8dc6404fb09e14956c9d42b8bb0542aa047076aa74815cd40580d0cc2adc9699",
        blockNumber: 5893208,
        data: "0x000000000000000000000000000000000000000000000011578dd90373b2eabe",
        index: 231,
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001b96b92314c44b159149f7e0303511fb2fc4774f",
          "0x0000000000000000000000002f9c91660986deccb0e1ab2a3957e67cf64db29d",
        ],
        transactionHash:
          "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
        transactionIndex: 54,
      },
      {
        _type: "log",
        address: "0x1B96B92314C44b159149f7E0303511fB2Fc4774f",
        blockHash:
          "0x8dc6404fb09e14956c9d42b8bb0542aa047076aa74815cd40580d0cc2adc9699",
        blockNumber: 5893208,
        data: "0x0000000000000000000000000000000000000000000096295dbf890133f5bbb60000000000000000000000000000000000000000009cd7695feeaef939c30d41",
        index: 232,
        topics: [
          "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
        ],
        transactionHash:
          "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
        transactionIndex: 54,
      },
      {
        _type: "log",
        address: "0x1B96B92314C44b159149f7E0303511fB2Fc4774f",
        blockHash:
          "0x8dc6404fb09e14956c9d42b8bb0542aa047076aa74815cd40580d0cc2adc9699",
        blockNumber: 5893208,
        data: "0x00000000000000000000000000000000000000000000000010a741a46278000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011578dd90373b2eabe",
        index: 233,
        topics: [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff",
          "0x0000000000000000000000002f9c91660986deccb0e1ab2a3957e67cf64db29d",
        ],
        transactionHash:
          "0x595b1684b8accec5fdd536dbdd9acb4ddcae9cfc21afcd65245d0a51a0e3582b",
        transactionIndex: 54,
      },
    ],
    logsBloom:
      "0x00200000000000100000000081000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000002000000008000000200000000000000000000400008000000000000000000000000100000000000040000000000000000000000010000000000000000000000000000000000000000000040001000000080000004000000000000000000000000000004000000000000000000000000000002000000000000000000002000000020000000000001000000100000000001000100000000080000000000004000000000000000000002000000000000000400000000000000000",
    status: 1,
    to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
  };

  it("parses swap for sellToPancakeSwap", async () => {
    const data = await parseSwap({
      txReceipt,
      txDescription: { name: "sellToPancakeSwap", value: 0n, args: [] },
      rpcUrl: RPC_TEST_URL,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "WBNB",
        amount: "1.2",
      },
      tokenOut: {
        symbol: "BUSD",
        amount: "319.903586514927545022",
      },
    });
  });
});
