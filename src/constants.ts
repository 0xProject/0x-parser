export const ERC20_TRANSFER_EVENT_HASH =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export const EXCHANGE_PROXY_ABI_URL =
  "https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json";

const cononicalExchangeProxy = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

export const CONTRACTS = {
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  permitAndCall: "0x1291C02D288de3De7dC25353459489073D11E1Ae",
  exchangeProxy: {
    arbitrum: cononicalExchangeProxy,
    avalanche: cononicalExchangeProxy,
    bsc: cononicalExchangeProxy,
    celo: cononicalExchangeProxy,
    ethereum: cononicalExchangeProxy,
    fantom: "0xdef189deaef76e379df891899eb5a00a94cbc250",
    optimism: "0xdef1abe32c034e558cdd535791643c58a13acc10",
    polygon: cononicalExchangeProxy,
  },
};
