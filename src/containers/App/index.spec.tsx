import ContentstackAppSDK from "@contentstack/app-sdk";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from ".";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));

const getData = vi.fn();
const mountAt = async (path: string, windowPath = path) => {
  window.history.pushState({}, "", windowPath);
  getData.mockResolvedValue({ value: 2 });
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue({
    location: { CustomField: { field: { getData, setData: vi.fn() }, frame: { updateHeight: vi.fn() } } },
    getConfig: vi.fn().mockResolvedValue({}),
    pulse: vi.fn(),
    stack: { _data: { api_key: "k" } },
    currentUser: { defaultOrganization: "o" },
  } as never);
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.pushState({}, "", "/");
});

describe("App routes", () => {
  it("/custom-field renders the CustomField with its stored value loaded", async () => {
    const { container } = await mountAt("/custom-field");
    await vi.waitFor(() => expect(container.querySelector(".layout-container")).not.toBeNull());
    expect(container.querySelectorAll(".empty-icons svg")).toHaveLength(5);
    expect(getData).toHaveBeenCalledOnce();
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
