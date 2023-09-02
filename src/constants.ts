import { SupportedChainId } from "./types";

export const EVENT_SIGNATURES = {
  LimitOrderFilled:
    "0xab614d2b738543c0ea21f56347cf696a3a0c42a7cbec3212a5ca22a4dcff2124",
  LiquidityProviderSwap:
    "0x40a6ba9513d09e3488135e0e0d10e2d4382b792720155b144cbea89ac9db6d34",
  OtcOrderFilled:
    "0xac75f773e3a92f1a02b12134d65e1f47f8a14eabe4eaf1e24624918e6a8b269f",
  MetaTransactionExecuted:
    "0x7f4fe3ff8ae440e1570c558da08440b26f89fb1c1f2910cd91ca6452955f121a",
  Transfer:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  TransformedERC20:
    "0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3",
} as const;

export const ERC20_FUNCTION_HASHES = {
  symbol: "0x95d89b41",
  decimals: "0x313ce567",
} as const;

export const EXCHANGE_PROXY_ABI_URL =
  "https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json";

const CONONICAL_EXCHANGE_PROXY = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

export const MULTICALL3 = "0xcA11bde05977b3631167028862bE2a173976CA11";

export const PERMIT_AND_CALL_BY_CHAIN_ID = {
  1: "0x1291C02D288de3De7dC25353459489073D11E1Ae",
  137: "0x2Ddd30fE5c12FC4CD497526F14Bf3d1fcd3D5Db4",
  8453: "0x3CA53031Ad0B86a304845e83644983Be3340895f",
} as const;

export const EXCHANGE_PROXY_BY_CHAIN_ID = {
  1: CONONICAL_EXCHANGE_PROXY,
  5: "0xF91bB752490473B8342a3E964E855b9f9a2A668e",
  10: "0xDEF1ABE32c034e558Cdd535791643C58a13aCC10",
  56: CONONICAL_EXCHANGE_PROXY,
  137: CONONICAL_EXCHANGE_PROXY,
  250: "0xDEF189DeAEF76E379df891899eb5A00a94cBC250",
  8453: CONONICAL_EXCHANGE_PROXY,
  42161: CONONICAL_EXCHANGE_PROXY,
  42220: CONONICAL_EXCHANGE_PROXY,
  43114: CONONICAL_EXCHANGE_PROXY,
} as const;

export const CONTRACTS = {
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
} as const;

export const NATIVE_ASSET = {
  symbol: "ETH",
  decimals: 18,
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
} as const;

export const NATIVE_SYMBOL_BY_CHAIN_ID: Record<SupportedChainId, string> = {
  1: "ETH", // Ethereum
  5: "ETH", // Goerli
  10: "ETH", // Optimism
  56: "BNB", // BNB Chain
  137: "MATIC", // Polygon
  250: "FTM", // Fantom
  8453: "ETH", // Base
  42161: "ETH", // Arbitrum One
  42220: "CELO", // Celo
  43114: "AVAX", // Avalanche
} as const;

export enum TRANSACTION_STATUS {
  REVERTED = "reverted",
  SUCCESS = "success",
}
