import ContentstackAppSDK from "@contentstack/app-sdk";
import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { fakeId, makeSdk as makeFakeSdk } from "../../test-utils/sdk";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));

const makeSdk = () => {
  const { sdk } = makeFakeSdk();
  sdk.getConfig.mockResolvedValue({ key: "cfg" });
  sdk.currentUser.defaultOrganization = "org1";
  return sdk;
};

const Consumer = () => {
  const { appSdk, appConfig } = useContext(MarketplaceAppContext);
  return <div>child sdk={String(appSdk === sdkRef)} cfg={JSON.stringify(appConfig)}</div>;
};
let sdkRef: unknown;

const mountWith = (sdk: ReturnType<typeof makeSdk>) => {
  sdkRef = sdk;
  vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
  return render(<MarketplaceAppProvider><Consumer /></MarketplaceAppProvider>);
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("MarketplaceAppProvider", () => {
  it("renders Loading... while init is pending", () => {
    vi.mocked(ContentstackAppSDK.init).mockReturnValue(new Promise(() => {}) as never);
    render(<MarketplaceAppProvider><Consumer /></MarketplaceAppProvider>);
    expect(screen.getByText("Loading...")).toBeTruthy();
    expect(screen.queryByText(/child/)).toBeNull();
  });

  it("provides appSdk and config, sets frame height to 350", async () => {
    const sdk = makeSdk();
    mountWith(sdk);
    expect(await screen.findByText('child sdk=true cfg={"key":"cfg"}')).toBeTruthy();
    expect(sdk.getConfig).toHaveBeenCalledOnce();
    expect(sdk.location.CustomField.frame.updateHeight).toHaveBeenCalledExactlyOnceWith(350);
  });

  it("sends the Viewed pulse in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const sdk = makeSdk();
    mountWith(sdk);
    await screen.findByText(/child/);
    expect(sdk.pulse).toHaveBeenCalledExactlyOnceWith(
      "Viewed",
      expect.objectContaining({
        Stack: fakeId("stack"),
        Organization: "org1",
        "App Location": "CustomField",
        "User Id": "u1",
      })
    );
  });

  it("does not pulse outside production", async () => {
    const sdk = makeSdk();
    mountWith(sdk);
    await screen.findByText(/child/);
    expect(sdk.pulse).not.toHaveBeenCalled();
  });

  it("renders AppFailed when init rejects", async () => {
    vi.mocked(ContentstackAppSDK.init).mockRejectedValue(new Error("init failed"));
    render(<MarketplaceAppProvider><Consumer /></MarketplaceAppProvider>);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Something went wrong. Please try refreshing the page.");
    expect(screen.queryByText(/child/)).toBeNull();
    expect(screen.queryByText("Loading...")).toBeNull();
  });
});
