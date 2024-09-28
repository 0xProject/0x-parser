import {
  bsc,
  base,
  blast,
  linea,
  scroll,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  avalanche,
} from "viem/chains";
import type { SupportedChainId } from "./types";

export const SETTLER_META_TXN_ABI = [
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
] as const;

export const FUNCTION_SELECTORS = { EXECUTE_META_TXN: "0xfd3ad6d4" };

export const NATIVE_SYMBOL_BY_CHAIN_ID: { [key in SupportedChainId]: string } =
  {
    [bsc.id]: bsc.nativeCurrency.symbol,
    [base.id]: base.nativeCurrency.symbol,
    [blast.id]: blast.nativeCurrency.symbol,
    [linea.id]: linea.nativeCurrency.symbol,
    [scroll.id]: scroll.nativeCurrency.symbol,
    [mainnet.id]: mainnet.nativeCurrency.symbol,
    [polygon.id]: polygon.nativeCurrency.symbol,
    [optimism.id]: optimism.nativeCurrency.symbol,
    [arbitrum.id]: arbitrum.nativeCurrency.symbol,
    [avalanche.id]: avalanche.nativeCurrency.symbol,
  };

export const NATIVE_TOKEN_ADDRESS = `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`;

export const MULTICALL3_ADDRESS = `0xcA11bde05977b3631167028862bE2a173976CA11`;

export const ERC_4337_ENTRY_POINT = `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`;
