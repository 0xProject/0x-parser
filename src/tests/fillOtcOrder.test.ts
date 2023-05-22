import { it, expect } from "vitest";
import { parseSwap } from "../index";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

// https://etherscan.io/tx/0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb
it("parses swap for fillOtcOrder", async () => {
  const data = await parseSwap({
    transactionHash:
      "0xc9579b9e3cddebd3d48ccb0a719456d7c46869b2c3a536509ea88685c7a5efbb",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: ETH_MAINNET_RPC,
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
