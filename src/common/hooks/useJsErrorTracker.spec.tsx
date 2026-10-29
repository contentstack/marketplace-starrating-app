import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useJSErrorTracking } from "./useJsErrorTracker";

describe("useJSErrorTracking", () => {
  it("trackError and setErrorsMetaData are no-ops that never throw", () => {
    const { trackError, setErrorsMetaData } = renderHook(() => useJSErrorTracking()).result.current;
    expect(trackError(new Error("x"))).toBeUndefined();
    expect(setErrorsMetaData({ a: "b" })).toBeUndefined();
  });

  it("returns stable function identities across renders", () => {
    const { result, rerender } = renderHook(() => useJSErrorTracking());
    const first = result.current;
    rerender();
    expect(result.current.trackError).toBe(first.trackError);
    expect(result.current.setErrorsMetaData).toBe(first.setErrorsMetaData);
  });
});
