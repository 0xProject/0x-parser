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
};

export const EXCHANGE_PROXY_ABI_URL =
  "https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json";

const CONONICAL_EXCHANGE_PROXY = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

export const CONTRACTS = {
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  permitAndCall: "0x1291C02D288de3De7dC25353459489073D11E1Ae",
  exchangeProxy: {
    arbitrum: CONONICAL_EXCHANGE_PROXY,
    avalanche: CONONICAL_EXCHANGE_PROXY,
    bsc: CONONICAL_EXCHANGE_PROXY,
    celo: CONONICAL_EXCHANGE_PROXY,
    ethereum: CONONICAL_EXCHANGE_PROXY,
    fantom: "0xdef189deaef76e379df891899eb5a00a94cbc250",
    optimism: "0xdef1abe32c034e558cdd535791643c58a13acc10",
    polygon: CONONICAL_EXCHANGE_PROXY,
  },
};

export const NATIVE_ASSET = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const NATIVE_SYMBOL_BY_CHAIN_ID: { [chainId: number]: string } = {
  1: "ETH", // Ethereum
  5: "ETH", // Goerli
  10: "ETH", // Optimism
  56: "BNB", // BSC
  137: "MATIC", // Polygon
  250: "FTM", // Fantom
  8453: "ETH", // Base
  42161: "ETH", // Arbitrum One
  42220: "CELO", // Celo
  43114: "AVAX", // Avalanche
  84531: "ETH", // Base Goerli
};
