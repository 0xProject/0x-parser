import { describe, expect, it } from "vitest";
import { erc20Rpc, formatUnits, parseHexDataToString } from "./index";

require("dotenv").config();

const RPC_TEST_URL = process.env.RPC_TEST_URL;

if (!RPC_TEST_URL) {
  throw new Error("Missing environment variable `RPC_TEST_URL`");
}

describe("utils", () => {
  describe("erc20Rpc", () => {
    it("retrieves the correct token symbol", async () => {
      expect(
        await erc20Rpc.getSymbol(
          "0x6b175474e89094c44da98b954eedeac495271d0f",
          RPC_TEST_URL
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
});
