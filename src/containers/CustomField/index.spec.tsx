import { act, cleanup, render } from "@testing-library/react";
import { Rating } from "react-simple-star-rating";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CustomFieldExtensionContext } from "../../common/contexts/customFieldExtensionContext";
import { MarketplaceAppContext } from "../../common/contexts/marketplaceContext";
import CustomField from "./index";

// Wrap the real Rating so tests can read the props it receives and still render it.
vi.mock("react-simple-star-rating", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-simple-star-rating")>();
  return { ...actual, Rating: vi.fn(actual.Rating) };
});

const ratingMock = vi.mocked(Rating);
const lastProps = () => ratingMock.mock.lastCall![0];

const renderField = (opts: {
  sdk?: boolean;
  customField?: unknown;
  setFieldData?: ((d: unknown) => Promise<void>) | undefined;
}) => {
  const { sdk = true, customField = null, setFieldData } = opts;
  return render(
    <MarketplaceAppContext.Provider
      value={{ appSdk: sdk ? ({} as never) : null, appConfig: null }}
    >
      <CustomFieldExtensionContext.Provider
        value={{ customField, setFieldData: setFieldData as never, loading: false }}
      >
        <CustomField />
      </CustomFieldExtensionContext.Provider>
    </MarketplaceAppContext.Provider>
  );
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  ratingMock.mockClear();
});

describe("CustomField", () => {
  it("renders five real stars when the SDK is available", () => {
    const { container } = renderField({});
    expect(container.querySelector(".layout-container")).not.toBeNull();
    expect(container.querySelectorAll(".empty-icons svg")).toHaveLength(5);
  });

  it("renders no rating without the SDK", () => {
    const { container } = renderField({ sdk: false });
    expect(ratingMock).not.toHaveBeenCalled();
    expect(container.querySelector(".react-simple-star-rating")).toBeNull();
  });

  it.each([
    [{ value: 2.5 }, 50],
    [{ value: 5 }, 100],
    [{ value: 0.5 }, 10],
    [{ value: 0 }, 0],
    [{}, 0],
    [null, 0],
  ])("shows stored %j as ratingValue %d", (stored, expected) => {
    renderField({ customField: stored });
    expect(lastProps().ratingValue).toBe(expected);
  });

  it("enables half icons and tooltip", () => {
    renderField({});
    expect(lastProps().allowHalfIcon).toBe(true);
    expect(lastProps().showTooltip).toBe(true);
  });

  it.each([
    [50, 2.5],
    [100, 5],
    [10, 0.5],
  ])("saves click %d as { value: %d }", async (clicked, saved) => {
    const setFieldData = vi.fn().mockResolvedValue(undefined);
    renderField({ setFieldData });
    await act(async () => {
      await lastProps().onClick!(clicked);
    });
    expect(setFieldData).toHaveBeenCalledExactlyOnceWith({ value: saved });
  });

  it("logs an error and saves nothing when setFieldData is missing", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    renderField({ setFieldData: undefined });
    await act(async () => {
      await lastProps().onClick!(50);
    });
    expect(err).toHaveBeenCalledExactlyOnceWith("Something went wrong while saving data.");
  });

  it("catches and logs a rejected save without throwing", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("boom");
    const setFieldData = vi.fn().mockRejectedValue(failure);
    renderField({ setFieldData });
    await act(async () => {
      await expect(lastProps().onClick!(50)).resolves.toBeUndefined();
    });
    expect(setFieldData).toHaveBeenCalledOnce();
    expect(err).toHaveBeenCalledExactlyOnceWith("Error occurred while saving data:", failure);
  });
});
