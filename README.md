# 0x-parser

[![npm version](https://img.shields.io/npm/v/@0x/0x-parser.svg?logo=npm)](https://www.npmjs.com/package/@0x/0x-parser)
[![minified size](https://img.shields.io/bundlephobia/min/@0x/0x-parser)](https://bundlephobia.com/package/@0x/0x-parser)
[![codecov](https://codecov.io/gh/0xproject/0x-parser/branch/main/graph/badge.svg?token=OnNsoc2OrF)](https://codecov.io/gh/0xproject/0x-parser)
[![build and test](https://github.com/0xproject/0x-parser/actions/workflows/test.yml/badge.svg)](https://github.com/0xproject/0x-parser/actions/workflows/test.yml)
[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white&style=flat-square)](https://medium.com/@henballs/0x-parser-parsing-dex-transactions-9f9a6579d489)

## Blockchain Support

| <img alt="arbitrum" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/arbitrum/info/logo.png" width="23"/> | <img alt="avalanche" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/avalanchec/info/logo.png" width="20"/> | <img alt="base" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/base/info/logo.png" width="20"/> | <img alt="bnb chain" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/binance/info/logo.png" width="21"/> | <img alt="celo" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/celo/info/logo.png" width="20"/> | <img alt="ethereum" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/ethereum/info/logo.png" width="21"/> | <img alt="fantom" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/fantom/info/logo.png" width="22"/> | <img alt="optimism" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/optimism/info/logo.png" width="22"/> | <img alt="polygon" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/polygon/info/logo.png" width="22"/> |
| :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
|                                                               Arbitrum                                                               |                                                                Avalanche                                                                |                                                             Base                                                             |                                                              BNB Chain                                                               |                                                             Celo                                                             |                                                               Ethereum                                                               |                                                              Fantom                                                              |                                                               Optimism                                                               |                                                              Polygon                                                               |

## Overview

This library is designed for [0x](https://0x.org/docs/introduction/introduction-to-0x) integrators, simplifying the complex task of parsing [0x transactions](https://etherscan.io/address/0xdef1c0ded9bec7f1a1670819833240f027b25eff) into a format that is both user-friendly and easy to understand. When swapping tokens, one of the challenges is that the trade can experience slippage through Automated Market Makers ([AMMs](https://0x.org/post/what-is-an-automated-market-maker-amm)). This makes the final swap amounts difficult to predict prior to executing the trade. However, this library overcomes that challenge by parsing the transaction receipt and event logs to accurately identify the final swap amounts. 

### Demo

Try out the parser in a [live code environment](https://codesandbox.io/p/sandbox/0x-parser-node-js-demo-3wpfhc?file=/index.js:13,1) directly in your browser 🌐. You can also experience it in action through the [demo UI app](https://0x-parser-demo.vercel.app), which is built with 0x-parser.

<p align="center">
  <img src="https://raw.githubusercontent.com/hzhu/yo/main/react-demo.png" alt="Screenshot of demo app using 0x-parser" width="650"/>
</p>

## Installation

### Step 1: Install Peer Dependencies

First, make sure you have the required peer dependency [viem](https://viem.sh) installed. If you haven't installed it yet, you can do so with the following command:

```
npm install viem
```

### Step 2: Install the Parsing Library

After installing the peer dependency, proceed to install the [@0x/0x-parser](https://www.npmjs.com/package/@0x/0x-parser) package:

```
npm install @0x/0x-parser
```

## Usage

```typescript
import { parseSwap } from "@0x/0x-parser";

async function main() {
  const response = await fetch(
    "https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json"
  );

  const data = await response.json();
  const exchangeProxyAbi = data.compilerOutput.abi;

  // You can pass any transaction hash from 0x Exchange Proxy:
  // https://etherscan.io/address/0xdef1c0ded9bec7f1a1670819833240f027b25eff
  const transactionHash = "0xd8637124d650268ae7680781809800e103a3a2bee9fec56083028fea6d98140b";

  const swap = await parseSwap({
    transactionHash,
    exchangeProxyAbi,
    rpcUrl: "https://eth.llamarpc.com",
  });

  console.log(swap); // Logs the swap details in the console.
}

main();
```

## Development

This repository contains example code that you can run locally, which is useful for the development process. The code can be found in `/examples/web/index.html` and you can run the code by running `npm run web:example`.

## Contributing

Contributions are always welcomed! Please read the [contributing guidelines](./.github/.CONTRIBUTING.md) before submitting a pull request.
