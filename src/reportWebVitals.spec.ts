import { describe, expect, it, vi } from "vitest";

const vitals = vi.hoisted(() => ({ onCLS: vi.fn(), onFCP: vi.fn(), onLCP: vi.fn(), onTTFB: vi.fn() }));
vi.mock("web-vitals", () => vitals);

import reportWebVitals from "./reportWebVitals";

describe("reportWebVitals", () => {
  it("passes the callback to the four web-vitals reporters", async () => {
    const cb = vi.fn();
    reportWebVitals(cb);
    await vi.waitFor(() => expect(vitals.onTTFB).toHaveBeenCalledWith(cb));
    for (const fn of Object.values(vitals)) expect(fn).toHaveBeenCalledWith(cb);
  });

  it("does nothing without a callback", async () => {
    vi.clearAllMocks();
    reportWebVitals();
    await new Promise((r) => setTimeout(r, 20));
    for (const fn of Object.values(vitals)) expect(fn).not.toHaveBeenCalled();
  });
});
