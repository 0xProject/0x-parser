import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

// https://etherscan.io/tx/0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb
it("parses swap for fillOtcOrder", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: RPC_TEST_URL,
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "50000",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    tokenOut: {
      symbol: "LDO",
      amount: "21120.508370504671821824",
      address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    },
  });
});
