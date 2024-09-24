import {
  http,
  createPublicClient,
  type PublicClient,
  type Transport,
  type Chain,
} from "viem";
import {
  base,
  scroll,
  polygon,
  mainnet,
  arbitrum,
  optimism,
} from "viem/chains";
import { test, expect } from "vitest";
import { parseSwap } from "../index";
import { NATIVE_TOKEN_ADDRESS } from "../constants";

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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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
    await parseSwap({
      publicClient,
      transactionHash,
    });
  }).rejects.toThrowError("chainId 42220 is unsupported…");
});

// https://basescan.org/tx/0x314ea35ef3120934ee4714f4815dc3b08dc2ab0e32e0662bfba3cdbcff14d79b
test("parse a gasless swap on Base (DAI for USDC)", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x314ea35ef3120934ee4714f4815dc3b08dc2ab0e32e0662bfba3cdbcff14d79b";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "DAI",
      amount: "1.998484821908329022",
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "1.982641",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  });
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

  const result = await parseSwap({
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

  const result = await parseSwap({
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
      address: NATIVE_TOKEN_ADDRESS,
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

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "ETH",
      amount: "0.027500863104380774",
      address: NATIVE_TOKEN_ADDRESS,
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

  const result = await parseSwap({
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
      address: NATIVE_TOKEN_ADDRESS,
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

  const result = await parseSwap({
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

// https://basescan.org/tx/0x14416958953850c5c5a572d6e8cb832c032d0678b3ce9da6cdce891a20864b99
test("parse a gasless swap on Base (USDC for ETH) for SettlerMetaTxn", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x14416958953850c5c5a572d6e8cb832c032d0678b3ce9da6cdce891a20864b99";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "21.27865",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    tokenOut: {
      symbol: "ETH",
      amount: "0.006847116541535933",
      address: NATIVE_TOKEN_ADDRESS,
    },
  });
});

// https://basescan.org/tx/0x29b3f7bcd154e20e050793aa62d90309a860296aa846fd1158dc21356d1a3deb
test("parse a gasless swap on Base (weirdo for ETH) for SettlerMetaTxn", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x29b3f7bcd154e20e050793aa62d90309a860296aa846fd1158dc21356d1a3deb";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "weirdo",
      amount: "3145398.30971883",
      address: "0x76734B57dFe834F102fB61E1eBF844Adf8DD931e",
    },
    tokenOut: {
      symbol: "ETH",
      amount: "0.039633073597929391",
      address: NATIVE_TOKEN_ADDRESS,
    },
  });
});

// https://basescan.org/tx/0xe595dec22a7e2c2c5bdb0c1a7e59b2302ede72e5d2210c6cd7071222ea6dc2b2
test("parse a gasless swap on Base (DEGEN for USDC) for SettlerMetaTxn", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0xe595dec22a7e2c2c5bdb0c1a7e59b2302ede72e5d2210c6cd7071222ea6dc2b2";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "DEGEN",
      amount: "1392.424785087824779911",
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "9.915288",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
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

  const result = await parseSwap({
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
      address: NATIVE_TOKEN_ADDRESS,
    },
  });
});

// https://optimistic.etherscan.io/tx/0xdfd5180c9f84d8f7381f48550dd14df86dd704489c251a10a67bd3cfdb0ae626
test("parse a gasless swap on Optimism (USDC for OP) for executeMetaTxn", async () => {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0xdfd5180c9f84d8f7381f48550dd14df86dd704489c251a10a67bd3cfdb0ae626";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "5",
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    tokenOut: {
      symbol: "OP",
      amount: "2.744026666231502743",
      address: "0x4200000000000000000000000000000000000042",
    },
  });
});

// https://optimistic.etherscan.io/tx/0x9abc33ffc67ff9348af9a29f109c4f27b36ee5bc80dd81ae3814e69309449a61
test("parse a gasless swap on Optimism (USDC for OP) for execute", async () => {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x9abc33ffc67ff9348af9a29f109c4f27b36ee5bc80dd81ae3814e69309449a61";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "5",
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    tokenOut: {
      symbol: "OP",
      amount: "2.73214427938472425",
      address: "0x4200000000000000000000000000000000000042",
    },
  });
});

// TODO: remove skip or test different tx hash, RPC provider cannot fetch this transaction hash.
// https://bscscan.com/tx/0xdda12da1e32c3320082355c985d6f2c6559169989de51e3cc83123395516c057
test.skip("parse a swap on BNB Chain (ETH for USDC) for execute", async () => {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(
      `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0xdda12da1e32c3320082355c985d6f2c6559169989de51e3cc83123395516c057";

  const result = await parseSwap({
    publicClient,
    transactionHash,
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "ETH",
      amount: "0.728252933682622857",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "2260.511889276471849176",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    },
  });
});

test("throws when smart contract wallet is not passed", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash =
    "0x756289cdedd4c007268ef208fe2758a9fb6efd49fb241397b67089512b497662";

  expect(async () => {
    await parseSwap({
      publicClient,
      transactionHash,
    });
  }).rejects.toThrowError(
    "This is an ERC-4337 transaction. You must provide a smart contract wallet address to 0x-parser."
  );
});

// https://basescan.org/tx/0x756289cdedd4c007268ef208fe2758a9fb6efd49fb241397b67089512b497662
test("parse a swap on Base (DEGEN for BRETT) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0x756289cdedd4c007268ef208fe2758a9fb6efd49fb241397b67089512b497662`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "DEGEN",
      amount: "882.414233540058884907",
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    },
    tokenOut: {
      symbol: "BRETT",
      amount: "48.014669721245576995",
      address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    },
  });
});

// https://basescan.org/tx/0xaa09479aafdb1a33815fb3842c350ccedf5e3f9eaec31b8cba1f41eea674a8f3
test("parse a swap on Base (BRETT for ETH) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0xaa09479aafdb1a33815fb3842c350ccedf5e3f9eaec31b8cba1f41eea674a8f3`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "BRETT",
      amount: "48.014669721245576995",
      address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    },
    tokenOut: {
      symbol: "ETH",
      amount: "0.001482901054900327",
      address: NATIVE_TOKEN_ADDRESS,
    },
  });
});

// https://basescan.org/tx/0x283e2034885c34d2e2a5755e8ec77517c5eb8a2bf859a1a74b6dafec6f7ec73b
test("parse a meta transaction swap on Base (WETH for USDC)", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0x283e2034885c34d2e2a5755e8ec77517c5eb8a2bf859a1a74b6dafec6f7ec73b`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "WETH",
      amount: "0.0076565",
      address: "0x4200000000000000000000000000000000000006",
    },
    tokenOut: {
      symbol: "USDC",
      amount: "19.977303",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  });
});

// https://basescan.org/tx/0xe289a22987dcedfacb13584211c1d723ef5c42ea6e0dfd5c4d3271d20dec9ddc
test("parse a swap on Base (ETH for USDC) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0xe289a22987dcedfacb13584211c1d723ef5c42ea6e0dfd5c4d3271d20dec9ddc`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "ETH",
      amount: "0.001",
      address: NATIVE_TOKEN_ADDRESS,
    },
    tokenOut: {
      symbol: "USDC",
      amount: "2.600807",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  });
});

// https://polygonscan.com/tx/0xc624eb3ea779d1645571b5a538683eee1fb1bd9afdb1d0cb470de2b8755353a9
test("parse a swap on Polygon (MATIC for USDC) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0xc624eb3ea779d1645571b5a538683eee1fb1bd9afdb1d0cb470de2b8755353a9`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "MATIC",
      amount: "5",
      address: NATIVE_TOKEN_ADDRESS,
    },
    tokenOut: {
      symbol: "USDC",
      amount: "2.04366",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
  });
});

// https://polygonscan.com/tx/0x6ec07b99b37695a60915b3886476a86efdd4c60420ddcd158efd62f9c3fba074
test("parse a swap on Polygon (USDC for WMATIC) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0x6ec07b99b37695a60915b3886476a86efdd4c60420ddcd158efd62f9c3fba074`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "2.04366",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    tokenOut: {
      symbol: "WMATIC",
      amount: "4.996808166219061944",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
  });
});

// https://bscscan.com/tx/0xfd4730866f81a7007a586c21b97f56d3f1e62bbba7ebb65e52032676466a8ec1
test("parse a swap on BNB Chain (BNB for USDT) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(
      `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0xfd4730866f81a7007a586c21b97f56d3f1e62bbba7ebb65e52032676466a8ec1`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "BNB",
      amount: "0.001",
      address: NATIVE_TOKEN_ADDRESS,
    },
    tokenOut: {
      symbol: "USDT",
      amount: "0.537528100143963945",
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
  });
});

// https://bscscan.com/tx/0x5f8839d369b61c5325a4f5406f55e26310722744aa3177b62924e077cb705432
test("parse a swap on BNB Chain (USDT for BNB) with smart contract wallet", async () => {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(
      `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0x5f8839d369b61c5325a4f5406f55e26310722744aa3177b62924e077cb705432`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDT",
      amount: "1.874528100143963945",
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    tokenOut: {
      symbol: "BNB",
      amount: "0.003467772175199184",
      address: NATIVE_TOKEN_ADDRESS,
    },
  });
});

// https://basescan.org/tx/0x47b4e55bfaee712775a2181f0219db02647d1a2f97eeac6b4f6f2465aac64d86
test("gracefully handles a revert in a erc-4337 transaction", async () => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0x47b4e55bfaee712775a2181f0219db02647d1a2f97eeac6b4f6f2465aac64d86`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual(null);
});

// https://scrollscan.com/tx/0x84b07445a1a868b4338df8aed67c9ea330e771596bf603dbef8c12b3cb9970e5
test("parse a swap on Scroll(USDC for USDT) with execute", async () => {
  const publicClient = createPublicClient({
    chain: scroll,
    transport: http(
      `https://scroll-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  }) as PublicClient<Transport, Chain>;

  const transactionHash = `0x84b07445a1a868b4338df8aed67c9ea330e771596bf603dbef8c12b3cb9970e5`;

  const result = await parseSwap({
    publicClient,
    transactionHash,
    smartContractWallet: "0x3F6dAB60Cc16377Df9684959e20962f44De20988",
  });

  expect(result).toEqual({
    tokenIn: {
      symbol: "USDC",
      amount: "1",
      address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    },
    tokenOut: {
      symbol: "USDT",
      amount: "0.998168",
      address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    },
  });
});
