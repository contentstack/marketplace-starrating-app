import { describe, expect, it } from "vitest";
import getAppLocation from ".";

const sdk = (location: unknown) => ({ location }) as never;

describe("getAppLocation", () => {
  it("returns the first non-empty location key", () => {
    expect(getAppLocation(sdk({ Empty: {}, CustomField: { a: 1 }, Other: { b: 2 } }))).toBe("CustomField");
  });

  it("returns '' when every location is empty", () => {
    expect(getAppLocation(sdk({ A: {}, B: null }))).toBe("");
  });

  it("returns '' when there is no sdk", () => {
    expect(getAppLocation(undefined as never)).toBe("");
  });
});
