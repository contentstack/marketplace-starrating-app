import ContentstackAppSDK from "@contentstack/app-sdk";
import { expect, it, vi } from "vitest";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
vi.mock("./reportWebVitals", () => ({ default: vi.fn() }));

// The manifest loads the location at <host>/#/custom-field (MKT-19728), so the real entry must route on the hash.
it("renders the stars when Contentstack loads the field at #/custom-field", async () => {
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue({
    location: { CustomField: { field: { getData: vi.fn().mockResolvedValue({ value: 3 }), setData: vi.fn() }, frame: { updateHeight: vi.fn() } } },
    getConfig: vi.fn().mockResolvedValue({}),
    pulse: vi.fn(),
    stack: { _data: { api_key: "k" } },
    currentUser: { defaultOrganization: "o" },
  } as never);
  window.history.pushState({}, "", "/#/custom-field");
  document.body.innerHTML = '<div id="root"></div>';

  await import("./index");

  await vi.waitFor(() => expect(document.querySelectorAll(".empty-icons svg")).toHaveLength(5));
});
