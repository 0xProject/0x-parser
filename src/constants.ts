import type { SupportedChainId } from "./types";

export const SETTLER_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          {
            internalType: "contract IERC20",
            name: "buyToken",
            type: "address",
          },
          { internalType: "uint256", name: "minAmountOut", type: "uint256" },
        ],
        internalType: "struct SettlerBase.AllowedSlippage",
        name: "slippage",
        type: "tuple",
      },
      { internalType: "bytes[]", name: "actions", type: "bytes[]" },
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "msgSender", type: "address" },
      { internalType: "bytes", name: "sig", type: "bytes" },
    ],
    name: "executeMetaTxn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const FUNCTION_SELECTORS = { EXECUTE_META_TXN: "0xfd3ad6d4" };

export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const NATIVE_SYMBOL_BY_CHAIN_ID: { [key in SupportedChainId]: string } =
  {
    1: "ETH", // Ethereum
    10: "ETH", // Optimism
    56: "BNB", // BNB Chain
    137: "MATIC", // Polygon
    8453: "ETH", // Base
    42161: "ETH", // Arbitrum One
    43114: "AVAX", // Avalanche
  };

export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

export const NATIVE_ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
