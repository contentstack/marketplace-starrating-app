import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from ".";

const Boom = () => {
  throw new Error("boom");
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(<ErrorBoundary><p>fine</p></ErrorBoundary>);
    expect(screen.getByText("fine")).toBeTruthy();
    expect(screen.queryByText("Something went wrong.")).toBeNull();
  });

  it("renders the fallback and logs when a child throws", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText("Something went wrong.")).toBeTruthy();
    expect(err).toHaveBeenCalledWith("Uncaught error:", expect.any(Error), expect.anything());
  });
});
