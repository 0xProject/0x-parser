import {
  bsc,
  base,
  mode,
  blast,
  linea,
  scroll,
  mantle,
  plasma,
  mainnet,
  polygon,
  arbitrum,
  unichain,
  optimism,
  avalanche,
  berachain,
  worldchain,
  monad
} from "viem/chains";
import type { SupportedChainId } from "./types";


export const FORWARDING_MULTICALL_ABI = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "multicall",
    "inputs": [
      {
        "name": "calls",
        "type": "tuple[]",
        "internalType": "struct IMultiCall.Call[]",
        "components": [
          {
            "name": "target",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "revertPolicy",
            "type": "uint8",
            "internalType": "enum IMultiCall.RevertPolicy"
          },
          {
            "name": "value",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "contextdepth",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct IMultiCall.Result[]",
        "components": [
          {
            "name": "success",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "payable"
  }
]
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

export const SUPPORTED_CHAINS = [
  bsc,
  base,
  mode,
  blast,
  linea,
  scroll,
  mantle,
  mainnet,
  polygon,
  arbitrum,
  unichain,
  optimism,
  avalanche,
  berachain,
  worldchain,
  monad,
];

export const NATIVE_SYMBOL_BY_CHAIN_ID: { [key in SupportedChainId]: string } =
  {
    [bsc.id]: bsc.nativeCurrency.symbol,
    [base.id]: base.nativeCurrency.symbol,
    [mode.id]: mode.nativeCurrency.symbol,
    [blast.id]: blast.nativeCurrency.symbol,
    [linea.id]: linea.nativeCurrency.symbol,
    [scroll.id]: scroll.nativeCurrency.symbol,
    [mantle.id]: mantle.nativeCurrency.symbol,
    [monad.id]: monad.nativeCurrency.symbol,
    [plasma.id]: plasma.nativeCurrency.symbol,
    [mainnet.id]: mainnet.nativeCurrency.symbol,
    [polygon.id]: polygon.nativeCurrency.symbol,
    [unichain.id]: unichain.nativeCurrency.symbol,
    [optimism.id]: optimism.nativeCurrency.symbol,
    [arbitrum.id]: arbitrum.nativeCurrency.symbol,
    [avalanche.id]: avalanche.nativeCurrency.symbol,
    [berachain.id]: berachain.nativeCurrency.symbol,
    [worldchain.id]: worldchain.nativeCurrency.symbol,
  };

export const NATIVE_TOKEN_ADDRESS = `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`;

export const FORWARDING_MULTICALL_ADDRESS = `0x00000000000000cf9e3c5a26621af382fa17f24f`;
export const MULTICALL3_ADDRESS = `0xcA11bde05977b3631167028862bE2a173976CA11`;


export const ERC_4337_ENTRY_POINT = `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`;
