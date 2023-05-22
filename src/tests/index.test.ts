import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xe393e03e31ba2b938326ef0527aba08b4e7f2d144ac2a2172c57615990698ee6
it("returns null when the smart contract function name is not supported", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xe393e03e31ba2b938326ef0527aba08b4e7f2d144ac2a2172c57615990698ee6",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toBe(null);
});

// https://etherscan.io/tx/0x335b2a3faf4a15cd6f67f1ec7ed26ee04ea7cc248f5cd052967e6ae672af8d35
it("returns null when the transaction reverted", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x335b2a3faf4a15cd6f67f1ec7ed26ee04ea7cc248f5cd052967e6ae672af8d35",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toBe(null);
});
