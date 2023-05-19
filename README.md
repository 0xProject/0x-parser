# 0x-parser

[![npm version](https://img.shields.io/npm/v/@0x/0x-parser.svg?style=flat-square)](https://www.npmjs.com/package/@0x/0x-parser)
[![build and test](https://github.com/0xproject/0x-parser/actions/workflows/test.yml/badge.svg)](https://github.com/0xproject/0x-parser/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/0xproject/0x-parser/branch/main/graph/badge.svg?token=OnNsoc2OrF)](https://codecov.io/gh/0xproject/0x-parser)

Designed for [0x integrators](https://0x.org/docs/introduction/introduction-to-0x), this library offers a solution to parse swap amounts from 0x transactions, a task that becomes complex when trades involve Automated Market Makers (AMMs). Given the potential for [slippage](https://0x.org/post/what-is-slippage) in these trades, the final swap amounts cannot be anticipated before trade execution. This library addresses this challenge by accepting a transaction hash as input, then parsing through the event logs to identify the exact swap amounts.

## Installation

```
npm install @0x/0x-parser
```

## Usage

```javascript
import { parseSwap } from '@0x/0x-parser';

async function main() {
  const { getAddress, JsonRpcProvider, Contract } = ethers;
  const EXCHANGE_PROXY = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";
  const transactionHash = "0xf705df9127065ae8a8da3c1939d7096011ea13c81e4a2ed8c59ea1b039f7565d";
  const abiUrl = "https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json";
  const response = await fetch(abiUrl);
  const IZeroEx = await response.json();
  const { interface } = new Contract(EXCHANGE_PROXY, IZeroEx.compilerOutput.abi);
  const provider = new JsonRpcProvider("https://eth.llamarpc.com");
  const [tx, txReceipt] = await Promise.all([
    provider.getTransaction(transactionHash),
    provider.getTransactionReceipt(transactionHash),
  ]);
  const txDescription = interface.parseTransaction(tx);
  const data = await parseSwap({ rpcUrl: "https://eth.llamarpc.com", txReceipt, txDescription });

  console.log(JSON.stringify(data);
}

main();
```

## Live demo

Try a demo app that uses 0x-parser [here](https://0x-parser-demo.vercel.app/).

<img src="https://raw.githubusercontent.com/hzhu/yo/main/react-demo.png" alt="0x parser React demo app" width="650"/>

## Examples

This repository includes an example you can execute locally using the `npm run web:example` command. Additionally, there's another repository that showcases how to use this package within a simple React app, which you can find [here](https://github.com/hzhu/0x-parser-demo).

## Contributing

Contributions are welcomed! Please follow the [contributing guidelines](./.github/.CONTRIBUTING.md).
