import { it, expect } from "vitest";
import { parseSwap } from "../index";
import { exchangeProxyAbi } from "../abi/ExchangeProxyAbi";

const POLYGON_MAINNET_RPC = "https://rpc.ankr.com/polygon";

// https://polygonscan.com/tx/0xaa61b2058fafae1532565b6acadf47a8fe604518185f535e2780dd28d626e0ef
it("parses swap from executeMetaTransaction", async () => {
  const data = await parseSwap({
    exchangeProxyAbi,
    rpcUrl: POLYGON_MAINNET_RPC,
    transactionHash:
      "0xaa61b2058fafae1532565b6acadf47a8fe604518185f535e2780dd28d626e0ef",
  });

  expect(data).toEqual({
    tokenIn: {
      symbol: "WMATIC",
      amount: "8.54621988",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    tokenOut: {
      symbol: "PAXG",
      amount: "0.00488474242697242",
      address: "0x553d3D295e0f695B9228246232eDF400ed3560B5",
    },
  });
});
