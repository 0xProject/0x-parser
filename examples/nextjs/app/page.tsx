"use client";

import { useEffect, useState } from "react";
import type { TokenTransaction, ParseSwap } from "@0x/0x-parser";

let parseSwap: ParseSwap;

export default function Home() {
  const [txHash, setTxHash] = useState(
    "0xd8637124d650268ae7680781809800e103a3a2bee9fec56083028fea6d98140b"
  );
  const [data, setData] = useState<TokenTransaction | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lazyLoad = async () => {
      parseSwap = (await import("@0x/0x-parser")).parseSwap;
    };
    lazyLoad();
  }, []);

  return (
    <div className="p-4 text-left" style={{ fontFamily: "monospace" }}>
      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          async function fetchData() {
            setIsLoading(true);
            const response = await fetch(
              "https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json"
            );
            const IZeroEx = await response.json();
            const swapAmount = await parseSwap({
              rpcUrl: "https://eth.llamarpc.com",
              exchangeProxyAbi: IZeroEx.compilerOutput.abi,
              transactionHash: txHash,
            });
            setData(swapAmount);
            setIsLoading(false);
          }
          fetchData();
        }}
      >
        <fieldset>
          <legend className="text-4xl mb-4">0x Swap Amount</legend>
          <label htmlFor="txHash" className="text-based">
            Transaction hash:
          </label>
          <input
            required
            id="txHash"
            type="text"
            value={txHash}
            pattern="0x[a-fA-F0-9]{64}"
            placeholder="Ethereum Transaction Hash (0x…)"
            onChange={(event) => setTxHash(event.target.value)}
            title="Transaction hash should start with '0x' and be followed by 64 hexadecimal characters."
            className="h-7 mt-1 mb-5 text-base border border-gray-900 text-gray-900 focus:ring-blue-500 rounded-sm focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="text-base px-2 py-1 font-medium text-center text-white bg-gray-700 rounded-md hover:bg-gray-800 focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-blue-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-800"
          >
            Submit
          </button>
          <button
            type="button"
            className="text-sm ml-4 disabled:text-gray-400"
            disabled={isLoading || (txHash === "" && data === undefined)}
            onClick={() => {
              setTxHash("");
              setData(undefined);
            }}
          >
            Clear
          </button>
        </fieldset>
      </form>
      {isLoading ? (
        <div className="text-lg my-3 mx-1">Loading swap details…</div>
      ) : (
        <Details txHash={txHash} data={data} />
      )}
    </div>
  );
}

const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";
const EMPTY_IMAGE_URL = "https://etherscan.io/images/main/empty-token.png";

function Symbol({ symbol, address }: { symbol: string; address: string }) {
  const [imgSrc, setImgSrc] = useState(
    address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      ? `${BASE_IMAGE_URL}/ethereum/info/logo.png`
      : `${BASE_IMAGE_URL}/ethereum/assets/${address}/logo.png`
  );

  return (
    <div className="flex items-center">
      <img
        width="20px"
        height="20px"
        alt={symbol}
        src={imgSrc}
        className="mr-1"
        onError={() => setImgSrc(EMPTY_IMAGE_URL)}
      />
    </div>
  );
}

function Details({
  data,
  txHash,
}: {
  data: TokenTransaction | null;
  txHash: string;
}) {
  if (data === undefined) return null;
  if (data === null) {
    return (
      <div className="my-4 text-red-600">
        The current transaction hash may have reverted. Try a different
        transaction hash.
      </div>
    );
  }
  const { tokenIn, tokenOut } = data;

  return (
    <div className="border border-gray-700 p-4 rounded-md text-center">
      <h3 className="text-2xl mb-2">Swapped</h3>
      <div className="mb-2 w-auto text-lg">
        <div className="flex justify-center">
          <Symbol symbol={tokenIn.symbol} address={tokenIn.address} />
          <div className="ml-1">
            {`${Number(tokenIn.amount).toLocaleString()} ${tokenIn.symbol}`}
          </div>
        </div>
        <div className="-my-1">⇊</div>
        <div className="flex justify-center">
          <Symbol symbol={tokenOut.symbol} address={tokenOut.address} />
          <div className="ml-1">
            {`${Number(tokenOut.amount).toLocaleString()} ${tokenOut.symbol}`}
          </div>
        </div>
      </div>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://etherscan.io/tx/${txHash}`}
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Block explorer
        <svg
          width="12"
          height="12"
          role="img"
          focusable="false"
          viewBox="0 0 12 12"
          className="inline-block mx-2"
          aria-label="opens in a new tab"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            d="M10.5 8.5V10c0 .3-.2.5-.5.5H2c-.3 0-.5-.2-.5-.5V2c0-.3.2-.5.5-.5h1.5M6 6l4-4m-3.5-.5H10c.3 0 .5.2.5.5v3.5"
          ></path>
        </svg>
      </a>
    </div>
  );
}
