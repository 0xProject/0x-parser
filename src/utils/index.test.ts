import { describe, expect, it } from "vitest";
import { parseHexDataToString } from "./index";

describe("parseHexDataToString", () => {
  it("should return empty string when input data does not contain any hexadecimal number", () => {
    const hexData =
      "0x00000000000000000000000000000000000000000000000000000000000000002"; // This does not have any hexadecimal number after the length field
    const result = parseHexDataToString(hexData);
    expect(result).toEqual("");
  });
});
