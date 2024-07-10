import {
  http,
  createPublicClient,
  type PublicClient,
  type Transport,
  type Chain,
} from "viem";
import { arbitrum, base, mainnet, polygon } from "viem/chains";
import { test, expect } from "vitest";
import { parseSwapV2 } from "../index";
import { NATIVE_ASSET } from "../constants";

require("dotenv").config();

if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("An Alchemy API key is required.");
}

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  ),
});

// https://etherscan.io/tx/0x2fc205711fc933ef6e5bcc0bf6e6a9bfc220b2d8073aea4f41305882f485669d
test("parses swapped amounts case 0 (default)", async () => {
  const transactionHash =
    "0x2fc205711fc933ef6e5bcc0bf6e6a9bfc220b2d8073aea4f41305882f485669d";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "KAI",
      amount: "12124969884.736401754",
      address: "0xA045Fe936E26e1e1e1Fb27C1f2Ae3643acde0171",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "340.919143",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  });
});

// https://etherscan.io/tx/0x2b9a12398613887e9813594e8583f488f0e8392d8e6e0ba8d9e140065826dd00
test("parses swapped amounts case 1 (default)", async () => {
  const transactionHash =
    "0x2b9a12398613887e9813594e8583f488f0e8392d8e6e0ba8d9e140065826dd00";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "30.084159",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "USDT",
      amount: "30.069172",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  });
});

// https://etherscan.io/tx/0x76b744ab42b05b30624bd5027b4f7da841cdc357bb1d6ee74e3d9e049dd8a126
test("parses swapped amounts case 2 (default)", async () => {
  const transactionHash =
    "0x76b744ab42b05b30624bd5027b4f7da841cdc357bb1d6ee74e3d9e049dd8a126";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "1",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.000280757770903965",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});

// https://etherscan.io/tx/0x565e8e0582b620ee06618ee0b7705dc0e7f56dfd88b5eb3e008c0858f6f806d8
test("parses swapped amounts case 3 (default)", async () => {
  const transactionHash =
    "0x565e8e0582b620ee06618ee0b7705dc0e7f56dfd88b5eb3e008c0858f6f806d8";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "8.15942",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "WBTC",
      amount: "0.00013188",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
  });
});

// https://etherscan.io/tx/0xd024750c7dcb99ace02c6b083c68d73dcfebdee252ccbeb1b83981b609693271
test("parses swapped amounts case 4 (default)", async () => {
  const transactionHash =
    "0xd024750c7dcb99ace02c6b083c68d73dcfebdee252ccbeb1b83981b609693271";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "335.142587",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "WETH",
      amount: "0.105662100963455883",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  });
});

// https://etherscan.io/tx/0x4cbcf2e2512adb7e28f19f8cf28ddc29a9f9fea93c842cf3b735eeb526fe34b3
test("parses swapped amounts case 5 (native sell token)", async () => {
  const transactionHash =
    "0x4cbcf2e2512adb7e28f19f8cf28ddc29a9f9fea93c842cf3b735eeb526fe34b3";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "ETH",
      amount: "0.04",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "126.580558",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  });
});

// https://etherscan.io/tx/0x28c5bb3768bb64e81e1f3753ed1a8c30f0484a434d6c2b4af825d258ecb3bcf0
test("parses swapped amounts case 6 (buy DNT 404 token)", async () => {
  const transactionHash =
    "0x28c5bb3768bb64e81e1f3753ed1a8c30f0484a434d6c2b4af825d258ecb3bcf0";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "95",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "CHIB",
      amount: "10.527633901274097318",
      address: "0x7068263EDa099fB93BB3215c05e728c0b54b3137",
    },
  });
});

// https://etherscan.io/tx/0xb8beef6bf857f2fc22905b2872120abc634900b45941478aa9cf0ad1ceffcd67
// https://gopluslabs.io/token-security/1/0xcf0c122c6b73ff809c693db761e7baebe62b6a2e
test("parses swapped amounts case 6 (buy FoT token, FLOKI)", async () => {
  const transactionHash =
    "0xb8beef6bf857f2fc22905b2872120abc634900b45941478aa9cf0ad1ceffcd67";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "31.580558",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "FLOKI",
      amount: "172036.330384861",
      address: "0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E",
    },
  });
});

// Gasless RFQ
// https://etherscan.io/tx/0x5dd4579b5709b405d6df935d516563e1db09453f37431639ae7e1358ec8f834d
test("parses swapped amounts from tx settled by gasless rfq)", async () => {
  const transactionHash =
    "0x5dd4579b5709b405d6df935d516563e1db09453f37431639ae7e1358ec8f834d";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "20",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    tokenOut: {
      symbol: "USDT",
      amount: "11.604822",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  });
});

// https://explorer.celo.org/tx/0x615c5089f772a8f2074750e8c6070013d288af7681435aba1771f6bfc63d1286
test("throws an error for unsupported chains)", async () => {
  const transactionHash =
    "0x615c5089f772a8f2074750e8c6070013d288af7681435aba1771f6bfc63d1286";

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http("https://rpc.ankr.com/celo"),
  });

  expect(async () => {
    await parseSwapV2({
      publicClient,
      transactionHash,
    });
  }).rejects.toThrowError("chainId 42220 is unsupported…");
});

// https://basescan.org/tx/0xa09cb1606e30c3aed8a842723fd6c23cecd838a59f750ab3dbc5ef2c7486e696
test("parse a swap on Base (USDC for DAI)", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0xa09cb1606e30c3aed8a842723fd6c23cecd838a59f750ab3dbc5ef2c7486e696";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "17.834287",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    tokenOut: {
      symbol: "DAI",
      amount: "17.843596331665784515",
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    },
  });
});

// https://basescan.org/tx/0xea8bca6e13f2c3e6c1e956308003b8d5da5fca44e03eac7ddbdcea271186ab37
test("parse a swap on Base (DEGEN for ETH)", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0xea8bca6e13f2c3e6c1e956308003b8d5da5fca44e03eac7ddbdcea271186ab37";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "DEGEN",
      amount: "3173.454530222930443426",
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    },
    tokenOut: {
      symbol: "ETH",
      amount: "0.006410046715601835",
      address: NATIVE_ASSET.address,
    },
  });
});

// https://basescan.org/tx/0x9e81eee3f09b79fe1e3700fdb79bf78098b6073ec17e3524498177407ac33a00
test("parse a swap on Base (ETH for BRETT)", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x9e81eee3f09b79fe1e3700fdb79bf78098b6073ec17e3524498177407ac33a00";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "ETH",
      amount: "0.027500863104380774",
      address: NATIVE_ASSET.address,
    },
    tokenOut: {
      symbol: "BRETT",
      amount: "698.405912537092209301",
      address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    },
  });
});

// https://polygonscan.com/tx/0x438517b81f50858035f4b8e0870f5d797616509b5102c28814bcc378559c213d
test("parse a gasless approval + gasless swap on Polygon (USDC for MATIC)", async () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x438517b81f50858035f4b8e0870f5d797616509b5102c28814bcc378559c213d";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "7.79692",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    tokenOut: {
      symbol: "MATIC",
      amount: "15.513683571865599415",
      address: NATIVE_ASSET.address,
    },
  });
});

// https://basescan.org/tx/0x40fc248824e11c11debb307a68ba04ff0f068c67de07e6817f5405e055b91c44
test("parse a gasless swap on Base (USDC for DEGEN)", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x40fc248824e11c11debb307a68ba04ff0f068c67de07e6817f5405e055b91c44";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "42.001841",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    tokenOut: {
      symbol: "DEGEN",
      amount: "6570.195174245277347697",
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    },
  });
});

// https://arbiscan.io/tx/0xb2c05194e4ec9ae0f82098ec82a606df544e87c8d6b7726bbb4b1dcc023cb9d7
test("parse a gasless swap on on Arbitrum (ARB for ETH)", async () => {
  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(
      `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0xb2c05194e4ec9ae0f82098ec82a606df544e87c8d6b7726bbb4b1dcc023cb9d7";

  const result = await parseSwapV2({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "ARB",
      amount: "1.337",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    },
    tokenOut: {
      symbol: "ETH",
      amount: "0.000304461782666722",
      address: NATIVE_ASSET.address,
    },
  });
});
