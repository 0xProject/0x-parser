import { it, expect } from "vitest";
import { parseSwap } from "../index";

const txReceiptSuccess = {
  from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  logs: [],
  logsBloom: "0x…",
  status: 1,
};

const txReceiptReverted = {
  ...txReceiptSuccess,
  status: 0,
};

const rpcUrl = "http://localhost:8545";

it("returns null when the smart contract function name is not recognized", async () => {
  const data = await parseSwap({
    txReceipt: txReceiptSuccess,
    txDescription: { name: "xxsellToUniswap", value: 0n, args: [] },
    rpcUrl,
  });

  expect(data).toBe(null);
});

it("returns null when the transaction reverted", async () => {
  const data = await parseSwap({
    txReceipt: txReceiptReverted,
    txDescription: { name: "sellToUniswap", value: 0n, args: [] },
    rpcUrl,
  });

  expect(data).toBe(null);
});
