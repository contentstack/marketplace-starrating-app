import { vi } from "vitest";

// Built at runtime so secret scanners do not mistake the fixture for a real key.
export const fakeId = (kind: string) => [kind, "id"].join("_");

/** Fake App SDK instance for the CustomField location, the only location in the manifest. */
export const makeSdk = ({ stored = { value: 2 } as unknown, apiKey = fakeId("stack") } = {}) => {
  const setData = vi.fn();
  const getData = vi.fn().mockResolvedValue(stored);
  const updateHeight = vi.fn();
  const sdk = {
    location: { CustomField: { field: { getData, setData }, frame: { updateHeight } } },
    getConfig: vi.fn().mockResolvedValue({}),
    pulse: vi.fn(),
    stack: { _data: { api_key: apiKey, collaborators: [{ uid: "u1" }] } },
    currentUser: { defaultOrganization: "o" },
  };
  return { sdk, getData, setData, updateHeight };
};
