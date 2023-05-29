import { describe, expect, it } from "vitest";
import { erc20Rpc, formatUnits, parseHexDataToString } from "./index";

require("dotenv").config();

const ETH_MAINNET_RPC = process.env.ETH_MAINNET_RPC;

if (!ETH_MAINNET_RPC) {
  throw new Error("Missing environment variable `ETH_MAINNET_RPC`");
}

describe("utils", () => {
  describe("erc20Rpc", () => {
    it("retrieves the correct token symbol", async () => {
      expect(
        await erc20Rpc.getSymbol(
          "0x6b175474e89094c44da98b954eedeac495271d0f",
          ETH_MAINNET_RPC
        )
      ).toBe("DAI");
    });
  });

  describe("formatUnits", () => {
    it("formats units, and parses hex data to string", async () => {
      expect(formatUnits("1000000000000000000", 18)).toBe("1");
    });
  });

  describe("parseHexDataToString", () => {
    it("parses hex data and returns the corresponding string", async () => {
      expect(
        parseHexDataToString(
          "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000045745544800000000000000000000000000000000000000000000000000000000"
        )
      ).toBe("WETH");
    });

    it("parses zero hex data and returns an empty string", async () => {
      expect(
        parseHexDataToString(
          "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000123456789ABCDEF"
        )
      ).toBe("");
    });
  });

  it("should return empty string when input data does not contain any hexadecimal number", () => {
    const hexData =
      "0x00000000000000000000000000000000000000000000000000000000000000002"; // This does not have any hexadecimal number after the length field
    const result = parseHexDataToString(hexData);
    expect(result).toEqual("");
  });
});
