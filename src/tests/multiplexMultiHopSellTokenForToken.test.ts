import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xf705df9127065ae8a8da3c1939d7096011ea13c81e4a2ed8c59ea1b039f7565d
it("parses swap for multiplexMultiHopSellTokenForToken", async () => {
  const data = await parseSwap({
    transactionHash: "0xf705df9127065ae8a8da3c1939d7096011ea13c81e4a2ed8c59ea1b039f7565d",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "LINK",
      amount: "503.8124966",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    tokenOut: {
      symbol: "DAO",
      amount: "2014.179756573835415392",
      address: "0x0f51bb10119727a7e5eA3538074fb341F56B09Ad",
    },
  });
});
