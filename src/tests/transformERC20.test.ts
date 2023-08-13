import { Contract } from "ethers";
import { it, expect, describe } from "vitest";
import { parseSwap } from "../index";
import { CONTRACTS } from "../constants";
import { transformERC20 } from "../parsers";
import EXCHANGE_PROXY_ABI from "../abi/IZeroEx.json";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("transformERC20", () => {
  it("returns undefined when TransformedERC20 topic is not found in logs", async () => {
    const contract = new Contract(
      CONTRACTS.exchangeProxyByChainId[1],
      EXCHANGE_PROXY_ABI.compilerOutput.abi
    );

    const transactionReceipt = {
      from: "0x8C410057a8933d579926dEcCD043921A974A24ee",
      hash: "0xee3ffb65f6c8e07b46471cc610cf721affeefed87098c7db30a8147d50eb2a65",
      logs: [],
      to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
    };

    const result = await transformERC20({
      transactionReceipt,
      contract,
      rpcUrl: ETH_MAINNET_RPC,
    } as any);

    expect(result).toBe(undefined);
  });
});

describe("transformERC20 on various networks", () => {
  // https://etherscan.io/tx/0x30d015e87dd5481609eec1c54433b8d4679fe641034971baf648d4528a9b0a35
  it("Ethereum mainnet: parse a swap with native input asset", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x30d015e87dd5481609eec1c54433b8d4679fe641034971baf648d4528a9b0a35",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        symbol: "ETH",
        amount: "332.666067836453233036",
      },
      tokenOut: {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
        amount: "500000.317382",
      },
    });
  });

  // https://etherscan.io/tx/0x4db5b7168686cdfb1469b47a67f03fb6199aa81f3d2a26c4a05835b8752d152d
  it("Ethereum mainnet: parse a swap with ERC-20 input asset", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x4db5b7168686cdfb1469b47a67f03fb6199aa81f3d2a26c4a05835b8752d152d",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: ETH_MAINNET_RPC,
    });

    expect(data).toEqual({
      tokenIn: {
        symbol: "USDT",
        amount: "275.0",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      tokenOut: {
        symbol: "MUTE",
        amount: "183.067612917791449241",
        address: "0xA49d7499271aE71cd8aB9Ac515e6694C755d400c",
      },
    });
  });

  // https://arbiscan.io/tx/0x3e48c1d1d3596ecfc1f9feb9e9613f5f5fc002b76743251c31eca8bc0aa30e21
  it("parse a swap on Arbitrum", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x3e48c1d1d3596ecfc1f9feb9e9613f5f5fc002b76743251c31eca8bc0aa30e21",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: "https://arb1.arbitrum.io/rpc",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
        amount: "36834.421293958495524657",
        symbol: "GMX",
      },
      tokenOut: {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: "1189.251717722346544033",
        symbol: "ETH",
      },
    });
  });

  // https://optimistic.etherscan.io/tx/0x0d8125a0d77af877c5efd475e0b2a8aa7451c2b5b95e2918387f8a038aacd718
  it("parse a swap on Optimism", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x0d8125a0d77af877c5efd475e0b2a8aa7451c2b5b95e2918387f8a038aacd718",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: "https://endpoints.omniatech.io/v1/op/mainnet/public",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: "51.0",
        symbol: "ETH",
      },
      tokenOut: {
        address: "0x9A601C5bb360811d96A23689066af316a30c3027",
        amount: "217794.381575767372449449",
        symbol: "PIKA",
      },
    });
  });

  // https://snowtrace.io/tx/0x989436aff2791d355a08b87c9a97288699ed5a44a75897a963925b1922e12dbb
  it("parse a swap on Avalanche", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x989436aff2791d355a08b87c9a97288699ed5a44a75897a963925b1922e12dbb",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        amount: "25650.0",
        symbol: "USDC",
      },
      tokenOut: {
        address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
        amount: "0.99966847",
        symbol: "BTC.b",
      },
    });
  });

  // https://ftmscan.com/tx/0xc48de1d0482475d76a13107b4d438605abe0d2223e75167fc46d6d6a54d954c2
  it("parse a swap on Fantom", async () => {
    const data = await parseSwap({
      transactionHash:
        "0xc48de1d0482475d76a13107b4d438605abe0d2223e75167fc46d6d6a54d954c2",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: "https://rpc.ftm.tools",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: "375000.0",
        symbol: "FTM",
      },
      tokenOut: {
        address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
        amount: "126441.837374",
        symbol: "USDC",
      },
    });
  });

  // https://bscscan.com/tx/0x789d6d51ceb6d32407c97757e4be90c12f789927453413318178bed0ebc53bc0
  it("parse a swap on BNB Chain", async () => {
    const data = await parseSwap({
      transactionHash:
        "0x789d6d51ceb6d32407c97757e4be90c12f789927453413318178bed0ebc53bc0",
      exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
      rpcUrl: "https://bscrpc.com",
    });

    expect(data).toEqual({
      tokenIn: {
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        amount: "400142.7162326532",
        symbol: "BUSD",
      },
      tokenOut: {
        address: "0x55d398326f99059fF775485246999027B3197955",
        amount: "399966.973708709289660215",
        symbol: "USDT",
      },
    });
  });
});

// https://explorer.celo.org/tx/0x615c5089f772a8f2074750e8c6070013d288af7681435aba1771f6bfc63d1286
it("parse a swap on Celo", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x615c5089f772a8f2074750e8c6070013d288af7681435aba1771f6bfc63d1286",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: "https://rpc.ankr.com/celo",
  });

  expect(data).toEqual({
    tokenIn: {
      address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
      amount: "500.0",
      symbol: "cUSD",
    },
    tokenOut: {
      address: "0x74c0C58B99b68cF16A717279AC2d056A34ba2bFe",
      amount: "23390.112524333224016754",
      symbol: "SOURCE",
    },
  });
});

// https://basescan.org/tx/0x26ca796e654a3667957c25e7714c5d6d5de1fc845ebf98d8ee217f9f5e2c5f34
it("parse a swap on Base", async () => {
  const data = await parseSwap({
    transactionHash:
      "0x26ca796e654a3667957c25e7714c5d6d5de1fc845ebf98d8ee217f9f5e2c5f34",
    exchangeProxyAbi: EXCHANGE_PROXY_ABI.compilerOutput.abi,
    rpcUrl: "https://mainnet.base.org",
  });

  expect(data).toEqual({
    tokenIn: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amount: "0.005446885313391051",
      symbol: "ETH",
    },
    tokenOut: {
      address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      amount: "10.049999",
      symbol: "USDbC",
    },
  });
});
