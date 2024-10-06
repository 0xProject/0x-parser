# Changelog

## [2.4.0](https://github.com/0xProject/0x-parser/compare/v2.3.0...v2.4.0) (2024-10-06)


### Features

* support new chain, blast ([410971b](https://github.com/0xProject/0x-parser/commit/410971b18111c6c69351eb0e1d1edb2203af48a0))

## [2.4.0](https://github.com/0xProject/0x-parser/compare/v2.3.0...v2.4.0) (2024-09-28)


### Features

* support new chain, blast ([410971b](https://github.com/0xProject/0x-parser/commit/410971b18111c6c69351eb0e1d1edb2203af48a0))

## [2.3.0](https://github.com/0xProject/0x-parser/compare/v2.2.0...v2.3.0) (2024-09-26)


### Features

* support linea + update polygon native symbol ([f2ff8c4](https://github.com/0xProject/0x-parser/commit/f2ff8c46c95efbcaa4760024de3af456b000b852))

## [2.2.0](https://github.com/0xProject/0x-parser/compare/v2.1.3...v2.2.0) (2024-09-24)


### Features

* support new chain, scroll ([5f5bed4](https://github.com/0xProject/0x-parser/commit/5f5bed4b72ac8975a55a70fb94adb2d2ed924260))

## [2.1.3](https://github.com/0xProject/0x-parser/compare/v2.1.2...v2.1.3) (2024-09-23)


### Bug Fixes

* use correct taker for meta transaction ([70caa91](https://github.com/0xProject/0x-parser/commit/70caa914995ddca04785e9f5dadfdcc185d34f09))

## [2.1.2](https://github.com/0xProject/0x-parser/compare/v2.1.1...v2.1.2) (2024-08-19)


### Bug Fixes

* ensure output values exist ([0c3dc98](https://github.com/0xProject/0x-parser/commit/0c3dc98f98e5948a5561fc7e1bac976dafc7f4be))

## [2.1.1](https://github.com/0xProject/0x-parser/compare/v2.1.0...v2.1.1) (2024-08-19)


### Bug Fixes

* return null for smart contract wallet reverts ([bcd9730](https://github.com/0xProject/0x-parser/commit/bcd9730f4ced823d7e9c3aefad6067918f9ecc47))

## [2.1.0](https://github.com/0xProject/0x-parser/compare/v2.0.2...v2.1.0) (2024-08-19)


### Features

* support parsing erc-4337 transactions ([373d143](https://github.com/0xProject/0x-parser/commit/373d14304a118eee1d73f686ff98cf4639b3719a))

## [2.0.2](https://github.com/0xProject/0x-parser/compare/v2.0.1...v2.0.2) (2024-08-11)


### Bug Fixes

* remove hardcoded settler meta txn contract ([70893de](https://github.com/0xProject/0x-parser/commit/70893de6c03e3041655bacf4cc75fa3750737e8c))

## [2.0.1](https://github.com/0xProject/0x-parser/compare/v2.0.0...v2.0.1) (2024-07-31)


### Bug Fixes

* parse latest executeMetaTxn from base ([f6a825c](https://github.com/0xProject/0x-parser/commit/f6a825c79a0f47efcf85209a2ba8c4673caa9b36))

## [2.0.0](https://github.com/0xProject/0x-parser/compare/v1.2.5...v2.0.0) (2024-07-18)


### ⚠ BREAKING CHANGES

* migrate project to 0x v2 & settler

### Features

* migrate project to 0x v2 & settler ([ec87786](https://github.com/0xProject/0x-parser/commit/ec877868564da53db540c0af4688dd92b4818630))

## [1.2.5](https://github.com/0xProject/0x-parser/compare/v1.2.4...v1.2.5) (2024-07-17)


### Bug Fixes

* filter from logs from taker for initial input ([fb218e5](https://github.com/0xProject/0x-parser/commit/fb218e5e50c59ac66eef36d33167fb1c772d5211))

## [1.2.4](https://github.com/0xProject/0x-parser/compare/v1.2.3...v1.2.4) (2024-07-16)


### Bug Fixes

* use logs if taker received found in logs ([ef27691](https://github.com/0xProject/0x-parser/commit/ef27691991fb63238e7f853ece90d10d93dd0f8f))

## [1.2.3](https://github.com/0xProject/0x-parser/compare/v1.2.2...v1.2.3) (2024-07-10)


### Bug Fixes

* erc-20 transfers for SettlerMetaTxn ([329a1fd](https://github.com/0xProject/0x-parser/commit/329a1fdf9654527cd5f10634bffc50c9e9f0b0c4))

## [1.2.2](https://github.com/0xProject/0x-parser/compare/v1.2.1...v1.2.2) (2024-07-10)


### Bug Fixes

* native transfers with SettlerMetaTxn ([1d659a6](https://github.com/0xProject/0x-parser/commit/1d659a6f01db14f409f6f8f117189d06809e1b4f))

## [1.2.1](https://github.com/0xProject/0x-parser/compare/v1.2.0...v1.2.1) (2024-07-10)


### Bug Fixes

* account for native token transfer & meta transactions ([2f65804](https://github.com/0xProject/0x-parser/commit/2f65804762688c233d6960292ae33a01a82ab138))

## [1.2.0](https://github.com/0xProject/0x-parser/compare/v1.1.1...v1.2.0) (2024-06-19)


### Features

* introduce parseSwapV2 for Settler ([a15fcc4](https://github.com/0xProject/0x-parser/commit/a15fcc4a4d6b217d1679bc14ef5f9b84a20ba220))

## [1.1.1](https://github.com/0xProject/0x-parser/compare/v1.1.0...v1.1.1) (2024-06-03)


### Miscellaneous Chores

* upgrade deps ([1695559](https://github.com/0xProject/0x-parser/commit/1695559ae3d911b8d185c45dc166204fc9a45f78))

## [1.1.0](https://github.com/0xProject/0x-parser/compare/v1.0.4...v1.1.0) (2024-05-03)


### deps

* upgrade to viem v2 ([6a51a5f](https://github.com/0xProject/0x-parser/commit/6a51a5f3c67a8c54d5aa74dbd368ba3b32ce130b))


### Bug Fixes

* latest TS requires specific rootDir ([55b0dbc](https://github.com/0xProject/0x-parser/commit/55b0dbcc90a50fae747e9ed53b8bce52165f4898))

## [1.0.4](https://github.com/0xProject/0x-parser/compare/v1.0.3...v1.0.4) (2024-03-19)


### Bug Fixes

* use output log that has WETH for sellTokenForEthToUniswapV3 ([7660957](https://github.com/0xProject/0x-parser/commit/76609578159e64b70a9b3963041d8f7c87013364))

## [1.0.3](https://github.com/0xProject/0x-parser/compare/v1.0.2...v1.0.3) (2024-03-01)


### Bug Fixes

* bnb txs that do not transfer tokens to taker ([a1940e3](https://github.com/0xProject/0x-parser/commit/a1940e3d50de88d5fe7ba95fdac501ef77d09585))

## [1.0.2](https://github.com/0xProject/0x-parser/compare/v1.0.1...v1.0.2) (2023-09-10)


### Bug Fixes

* handle permitAndCall function overload ([34d01c9](https://github.com/0xProject/0x-parser/commit/34d01c93b94b84fcb60feff29573df26afbbd80e))

## [1.0.1](https://github.com/0xProject/0x-parser/compare/v1.0.0...v1.0.1) (2023-09-04)


### Performance Improvements

* parallelize rpc calls ([101172b](https://github.com/0xProject/0x-parser/commit/101172b77f99ce1c36742ea4e12e3584248009cf))

## [1.0.0](https://github.com/0xProject/0x-parser/compare/v0.6.0...v1.0.0) (2023-09-02)


### ⚠ BREAKING CHANGES

* viem as peer dependency

### Features

* viem as peer dependency ([f8c2239](https://github.com/0xProject/0x-parser/commit/f8c2239d05a142ec2c8956c1b74ce47aa72eed78))


### Bug Fixes

* account for identical permitAndCall function names ([1ead225](https://github.com/0xProject/0x-parser/commit/1ead2257e3d04e6bdf875c7e6dd8f64e8e80b304))
* handle zero transfer events for sellToPancakeSwap ([4ea566a](https://github.com/0xProject/0x-parser/commit/4ea566aa5a2b3d934ec3779f473fde945e7b2781))
* support sellEthForTokenToUniswapV3 multihop ([06f7faf](https://github.com/0xProject/0x-parser/commit/06f7fafb89cabba0bc58f8331222bf4c346231d1))

## [0.6.0](https://github.com/0xProject/0x-parser/compare/v0.5.0...v0.6.0) (2023-08-31)


### Features

* introduce viem + remove ethers ([1432283](https://github.com/0xProject/0x-parser/commit/14322832bc9a2a1717dddb2aef7285b8da2e4499))


### Bug Fixes

* remove exchange proxy abi from bundle... ([2b6e6f8](https://github.com/0xProject/0x-parser/commit/2b6e6f889e147f977785c1c402866b6401ec3afc))
* support multihop for sellToUniswap ([5128e75](https://github.com/0xProject/0x-parser/commit/5128e754eaec4755361a12a75c2d7c2a6b779f17))
* use native asset for parsers that need it ([ae82504](https://github.com/0xProject/0x-parser/commit/ae82504533dc249f849dab73e6f898a0d9663ac1))

## [0.5.0](https://github.com/0xProject/0x-parser/compare/v0.4.0...v0.5.0) (2023-08-13)


### Features

* add new addresses for permitandcall ([4cc8f86](https://github.com/0xProject/0x-parser/commit/4cc8f862267319f7ff0ad3351350a3cb94bff4ce))

## [0.4.0](https://github.com/0xProject/0x-parser/compare/v0.3.6...v0.4.0) (2023-08-13)


### Features

* add base support ([c4f9f4d](https://github.com/0xProject/0x-parser/commit/c4f9f4dafc791ab193c53e56a2b273922f0041e3))

## [0.3.6](https://github.com/0xProject/0x-parser/compare/v0.3.5...v0.3.6) (2023-06-19)


### Bug Fixes

* reduce rpc call for transformERC20 by one ([7803fb5](https://github.com/0xProject/0x-parser/commit/7803fb5d617811452091dbd1be43241f446a0b2b))
* reduce rpc calls for multiplexBatchSellTokenForToken by 80% ([03c0a04](https://github.com/0xProject/0x-parser/commit/03c0a0411567d0330b6e94fbc09e42799ed1252f))
* use exchange proxy address by chain id ([b3bbb88](https://github.com/0xProject/0x-parser/commit/b3bbb88c2f866c04090144c7081ae24e04c61f93))

## [0.3.5](https://github.com/0xProject/0x-parser/compare/v0.3.4...v0.3.5) (2023-06-13)


### Build System

* expand node support & update deps ([48f3d24](https://github.com/0xProject/0x-parser/commit/48f3d24616172a8c435a847c3e70952a15cf2563))

## [0.3.4](https://github.com/0xProject/0x-parser/compare/v0.3.3...v0.3.4) (2023-06-12)


### Build System

* update esbuild minification for nextjs ([26764e1](https://github.com/0xProject/0x-parser/commit/26764e1cbb7fb0dce5a14052ac02f0feafb13017))

## [0.3.3](https://github.com/0xProject/0x-parser/compare/v0.3.2...v0.3.3) (2023-06-11)


### Build System

* update type declarations ([68f609a](https://github.com/0xProject/0x-parser/commit/68f609adb15e4e1c3f54b5a79ae2d97d804d318f))

## [0.3.2](https://github.com/0xProject/0x-parser/compare/v0.3.1...v0.3.2) (2023-06-11)


### Build System

* update type declarations ([102befd](https://github.com/0xProject/0x-parser/commit/102befd82bdc904a0be0ebe0e63506bf9bfaa3d5))

## [0.3.1](https://github.com/0xProject/0x-parser/compare/v0.3.0...v0.3.1) (2023-06-11)


### Build System

* fix location of type declarations ([b38e8d5](https://github.com/0xProject/0x-parser/commit/b38e8d5bb637ad18fb04a00ae45f2c35877e154d))

## [0.3.0](https://github.com/0xProject/0x-parser/compare/v0.2.0...v0.3.0) (2023-06-11)


### Features

* export core types ([5751674](https://github.com/0xProject/0x-parser/commit/5751674a15ba2d7e4f037e44bf6dc4235e830e01))

## [0.2.0](https://github.com/0xProject/0x-parser/compare/v0.1.0...v0.2.0) (2023-05-30)


### Features

* introduce executeMetaTransactionV2 ([b51afd0](https://github.com/0xProject/0x-parser/commit/b51afd0f3b9116b2b19b742781e9b0d4e5ac1df6))
* update executeMetaTransactionV2 &  transformERC20 ([4ec05c2](https://github.com/0xProject/0x-parser/commit/4ec05c251489d4e13a56329a99cd5d94588a8fb7))


### Bug Fixes

* unwrap metatransaction from permitAndCall ([7aaa97b](https://github.com/0xProject/0x-parser/commit/7aaa97b4d6d5a23173223f0bc78dab31e4737781))

## [0.1.0](https://github.com/0xProject/0x-parser/compare/v0.0.5...v0.1.0) (2023-05-22)


### Features

* rewrite api interface ([b7d90e5](https://github.com/0xProject/0x-parser/commit/b7d90e5a975af857110361d2aea403dc1d1e38a7))

## 0.0.5 (2023-05-19)


### Features

* the initial commit ([5add299](https://github.com/0xProject/0x-parser/commit/5add29978a6192937a0f9e357381c2e676cc6397))
