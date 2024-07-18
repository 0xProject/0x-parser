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

export const SETTLER_META_TXN_BY_CHAIN_ID: {
  [key in SupportedChainId]: string;
} = {
  1: "0x7C39a136EA20B3483e402EA031c1f3C019bAb24b",
  10: "0x4069560a180EbD76bB1aF947f5119Fe555BB4eA0",
  56: "0x73C25Ef091Ce3F2451946Be3f982549776bFED31",
  137: "0xF9332450385291b6dcE301917aF6905e28E8f35f",
  8453: "0x5CE929DDB01804bfF35B2F5c77b735bdB094AAc8",
  42161: "0x1aa84EB5cb62f686FC0D908AFd85864f4A05d5Ee",
  43114: "0x2adb2cE26848B94E13d2f7fE0fF7E945050D741c",
};

export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

export const NATIVE_ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
