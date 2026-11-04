import ContentstackAppSDK from "@contentstack/app-sdk";
import { beforeEach, expect, it, vi } from "vitest";

import manifest from "../update-app-info.json";
import { makeSdk } from "./test-utils/sdk";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
vi.mock("./reportWebVitals", () => ({ default: vi.fn() }));

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '<div id="root"></div>';
});

// Contentstack loads the manifest's custom field location at <host>/<path> (MKT-19728), so the real entry must route on the hash.
it("renders the stars when Contentstack loads the field at the manifest path", async () => {
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue(makeSdk({ stored: { value: 3 } }).sdk as never);
  window.history.pushState({}, "", manifest.ui_location.locations[0].meta[0].path);

  await import("./index");

  await vi.waitFor(() => expect(document.querySelectorAll(".empty-icons svg")).toHaveLength(5));
});

// Installations made before MKT-19728 still load <host>/custom-field with no hash; the home route redirects them onto the field.
it("renders the stars when an older installation loads the field at /custom-field", async () => {
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue(makeSdk({ stored: { value: 3 } }).sdk as never);
  window.history.pushState({}, "", "/custom-field");

  await import("./index");

  await vi.waitFor(() => expect(document.querySelectorAll(".empty-icons svg")).toHaveLength(5));
});
