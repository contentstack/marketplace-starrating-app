import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { useAppLocation } from "./useAppLocation";

const run = (appSdk: unknown) =>
  renderHook(() => useAppLocation(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MarketplaceAppContext.Provider value={{ appSdk: appSdk as never, appConfig: null }}>
        {children}
      </MarketplaceAppContext.Provider>
    ),
  }).result.current;

describe("useAppLocation", () => {
  it("returns the first non-empty location and its instance", () => {
    const custom = { field: { a: 1 } };
    const r = run({ location: { Empty: {}, CustomField: custom, Other: { b: 1 } } });
    expect(r.locationName).toBe("CustomField");
    expect(r.location).toBe(custom);
  });

  it("returns '' and null when all locations are empty", () => {
    expect(run({ location: { A: {} } })).toEqual({ locationName: "", location: null });
  });

  it("returns '' and null when there is no sdk", () => {
    expect(run(null)).toEqual({ locationName: "", location: null });
  });
});
