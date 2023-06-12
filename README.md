# 0x-parser

[![npm version](https://img.shields.io/npm/v/@0x/0x-parser.svg?style=flat-square)](https://www.npmjs.com/package/@0x/0x-parser)
[![build and test](https://github.com/0xproject/0x-parser/actions/workflows/test.yml/badge.svg)](https://github.com/0xproject/0x-parser/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/0xproject/0x-parser/branch/main/graph/badge.svg?token=OnNsoc2OrF)](https://codecov.io/gh/0xproject/0x-parser)

Designed for [0x integrators](https://0x.org/docs/introduction/introduction-to-0x), this library tackles the complex task of parsing swap amounts from [0x transactions](https://etherscan.io/address/0xdef1c0ded9bec7f1a1670819833240f027b25eff), particularly when trades involve Automated Market Makers (AMMs). Given these trades can experience [slippage](https://0x.org/post/what-is-slippage), the final swap amounts cannot be anticipated before executing the trade. This library takes a transaction hash as input and parses the event logs to identify the exact swap amounts. Try the demo [here](https://0x-parser-demo.vercel.app/).

<p align="center">
  <img style="" src="https://raw.githubusercontent.com/hzhu/yo/main/react-demo.png" alt="React demo app for 0x-parser" width="650"/>
</p>

## Installation

```
npm install @0x/0x-parser
```

## Usage

```typescript
import { parseSwap } from '@0x/0x-parser';

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

This package directly integrates the latest version of Ethers.js, a decision driven by the rapid and often inconsistent upgrade patterns observed in some web3 codebases. This decision simplifies the source code by eliminating the need to support multiple versions of Ethers.js. However, it may lead to redundancy if you're already using the provider and contract modules in the latest Ethers.js version. This redundancy, though, might not affect your application.

The impact this library may have on your app's bundle size varies depending on the context. It's not a concern for server-side scripts, but could influence the initial bundle size of client-side browser applications. Given this library tree-shakes Ethers.js dependencies, it's beneficial to use [lazy loading](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-external-libraries) to prevent an increase in your client application's initial bundle size. For a demonstration of this, refer to the example available [here](https://github.com/0xProject/0x-parser/tree/main/examples/nextjs).

## Examples

This repository includes examples you can execute locally. Navigate to the `/examples` directory for additional `README` information on how to run the demos locally. You can also explore a live demo of 0x-parser [here](https://0x-parser-demo.vercel.app/).

## Contributing

Contributions are always welcomed! Please read the [contributing guidelines](./.github/.CONTRIBUTING.md) before submitting a pull request.
