import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xba3a89b2164e5f169bc81e90a13f8946d110dffe2b53393953ea2a4fede8e81e
it("parses swap for multiplexMultiHopSellTokenForEth", async () => {
  const data = await parseSwap({
    transactionHash: "0xba3a89b2164e5f169bc81e90a13f8946d110dffe2b53393953ea2a4fede8e81e",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "LSS",
      amount: "20065.979484072366300492",
      address: "0x3B9BE07d622aCcAEd78f479BC0EDabFd6397E320",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "3.305750792360646949",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});
