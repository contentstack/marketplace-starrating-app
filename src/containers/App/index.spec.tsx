import ContentstackAppSDK from "@contentstack/app-sdk";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { makeSdk } from "../../test-utils/sdk";
import App from ".";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));

const { sdk, getData } = makeSdk();
const mountAt = async (path: string, windowPath = path) => {
  window.history.pushState({}, "", windowPath);
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
};

afterEach(() => {
  vi.clearAllMocks();
  window.history.pushState({}, "", "/");
});

describe("App routes", () => {
  it("/custom-field renders the CustomField with its stored value loaded", async () => {
    const { container } = await mountAt("/custom-field");
    await vi.waitFor(() => expect(container.querySelector(".layout-container")).not.toBeNull());
    expect(container.querySelectorAll(".empty-icons svg")).toHaveLength(5);
    await vi.waitFor(() => expect(getData).toHaveBeenCalledOnce());
    // the stored value 2 renders as 2 of 5 stars filled
    await vi.waitFor(() => expect(container.querySelector<HTMLElement>(".filled-icons")?.style.width).toBe("40%"));
  });

  it("/ with root pathname renders nothing from the custom field", async () => {
    const { container } = await mountAt("/");
    await vi.waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());
    expect(container.querySelector(".layout-container")).toBeNull();
  });

  it("/ redirects to the browser's current path", async () => {
    const { container } = await mountAt("/", "/custom-field");
    await vi.waitFor(() => expect(container.querySelector(".layout-container")).not.toBeNull());
  });
});
