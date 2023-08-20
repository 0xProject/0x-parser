# 0x-parser

[![npm version](https://img.shields.io/npm/v/@0x/0x-parser.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/@0x/0x-parser)
[![codecov](https://codecov.io/gh/0xproject/0x-parser/branch/main/graph/badge.svg?token=OnNsoc2OrF)](https://codecov.io/gh/0xproject/0x-parser)
[![build and test](https://github.com/0xproject/0x-parser/actions/workflows/test.yml/badge.svg)](https://github.com/0xproject/0x-parser/actions/workflows/test.yml)
[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white&style=flat-square)](https://medium.com/@henballs/0x-parser-parsing-dex-transactions-9f9a6579d489)

## Blockchain Support

| <img alt="arbitrum" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/arbitrum/info/logo.png" width="23"/> | <img alt="avalanche" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/avalanchec/info/logo.png" width="20"/> | <img alt="base" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/base/info/logo.png" width="20"/> | <img alt="bnb chain" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/binance/info/logo.png" width="21"/> | <img alt="celo" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/celo/info/logo.png" width="20"/> | <img alt="ethereum" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/ethereum/info/logo.png" width="21"/> | <img alt="fantom" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/fantom/info/logo.png" width="22"/> | <img alt="optimism" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/optimism/info/logo.png" width="22"/> | <img alt="polygon" src="https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/polygon/info/logo.png" width="22"/> |
| :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
|                                                               Arbitrum                                                               |                                                                Avalanche                                                                |                                                             Base                                                             |                                                              BNB Chain                                                               |                                                             Celo                                                             |                                                               Ethereum                                                               |                                                              Fantom                                                              |                                                               Optimism                                                               |                                                              Polygon                                                               |

## Overview

This library is designed for [0x integrators](https://0x.org/docs/introduction/introduction-to-0x), and it simplifies the complex task of parsing [0x transactions](https://etherscan.io/address/0xdef1c0ded9bec7f1a1670819833240f027b25eff) into a format that is both user-friendly and easy to understand. One of the challenges when swapping tokens is that the trade can experience [slippage](https://0x.org/post/what-is-slippage) through [Automated Market Makers](<[AMMs](https://0x.org/post/what-is-an-automated-market-maker-amm)>) (AMMs), making the final swap amounts difficult to predict prior to executing the trade. However, this library overcomes that challenge by parsing the transaction receipt and event logs to accurately identify the final swap amounts. Try the demo [here](https://0x-parser-demo.vercel.app).

<p align="center">
  <img src="https://raw.githubusercontent.com/hzhu/yo/main/react-demo.png" alt="Screenshot of demo app using 0x-parser" width="650"/>
</p>

## Installation

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

  const IZeroEx = await response.json();

  const data = await parseSwap({
    rpcUrl: "https://eth.llamarpc.com",
    exchangeProxyAbi: IZeroEx.compilerOutput.abi,
    transactionHash: "0xd8637124d650268ae7680781809800e103a3a2bee9fec56083028fea6d98140b",
  });

  console.log(data);
}

main();
```

## Bundle Size

This package directly integrates the latest version of Ethers.js, a decision driven by the rapid and often inconsistent upgrade patterns observed in some web3 codebases. This decision simplifies the source code by eliminating the need to support multiple versions of Ethers.js. However, it may lead to redundancy if you're already using the provider and contract modules in the latest Ethers.js version. This redundancy, though, might not affect your application.

The impact this library may have on your app's bundle size varies depending on the context. It's not a concern for server-side scripts, but could influence the initial bundle size of client-side browser applications. Given this library tree-shakes Ethers.js dependencies, it's beneficial to use [lazy loading](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-external-libraries) to prevent an increase in your client application's initial bundle size. For a demonstration of lazy loading the library, refer to the example available [here](https://github.com/0xProject/0x-parser/tree/main/examples/nextjs).

## Examples

This repository includes examples you can execute locally. Navigate to the `/examples` directory for additional `README` information on how to run the demos locally. You can also explore a live demo of 0x-parser [here](https://0x-parser-demo.vercel.app/).

## Contributing

Contributions are always welcomed! Please read the [contributing guidelines](./.github/.CONTRIBUTING.md) before submitting a pull request.
