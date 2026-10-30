import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// ENV is read at module load, so stub it and re-import fresh copies of hook and context.
const load = async (env: string, pulse: () => void) => {
  vi.stubEnv("NODE_ENV", env);
  vi.resetModules();
  const { useAnalytics } = await import("./useAnalytics");
  const { MarketplaceAppContext } = await import("../contexts/marketplaceContext");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MarketplaceAppContext.Provider value={{ appSdk: { pulse } as never, appConfig: null }}>
      {children}
    </MarketplaceAppContext.Provider>
  );
  return renderHook(() => useAnalytics(), { wrapper }).result.current;
};

afterEach(() => vi.unstubAllEnvs());

describe("useAnalytics", () => {
  it("pulses the event in production", async () => {
    const pulse = vi.fn();
    const { trackEvent } = await load("production", pulse);
    trackEvent("Clicked", { a: "b" });
    expect(pulse).toHaveBeenCalledExactlyOnceWith("Clicked", { a: "b" });
  });

  it("defaults event data to {} in production", async () => {
    const pulse = vi.fn();
    const { trackEvent } = await load("production", pulse);
    trackEvent("Clicked");
    expect(pulse).toHaveBeenCalledExactlyOnceWith("Clicked", {});
  });

  it.each(["development", "test"])("does not pulse in %s", async (env) => {
    const pulse = vi.fn();
    const { trackEvent } = await load(env, pulse);
    trackEvent("Clicked");
    expect(pulse).not.toHaveBeenCalled();
  });
});
