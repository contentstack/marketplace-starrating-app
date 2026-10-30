import ContentstackAppSDK from "@contentstack/app-sdk";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from ".";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));

// Built at runtime so secret scanners do not mistake the fixture for a real key.
const fakeId = (kind: string) => [kind, "id"].join("_");

const getData = vi.fn();
const mountAt = async (path: string, windowPath = path) => {
  window.history.pushState({}, "", windowPath);
  getData.mockResolvedValue({ value: 2 });
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue({
    location: { CustomField: { field: { getData, setData: vi.fn() }, frame: { updateHeight: vi.fn() } } },
    getConfig: vi.fn().mockResolvedValue({}),
    pulse: vi.fn(),
    stack: { _data: { api_key: fakeId("stack") } },
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
