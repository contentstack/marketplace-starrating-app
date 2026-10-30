import { act, cleanup, render } from "@testing-library/react";
import { useContext, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CustomFieldExtensionContext,
  type CustomFieldExtensionContextType,
} from "../contexts/customFieldExtensionContext";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { CustomFieldExtensionProvider } from "./CustomFieldExtensionProvider";

afterEach(cleanup);

const setup = (field: { getData: () => Promise<unknown>; setData: (d: unknown) => Promise<void> }) => {
  // Stable sdk so the provider's effect deps do not change between renders.
  const appSdk = { location: { CustomField: { field } } } as never;
  let ctx!: CustomFieldExtensionContextType;
  const Probe = () => {
    ctx = useContext(CustomFieldExtensionContext);
    return null;
  };
  const Wrap = ({ children }: { children: ReactNode }) => (
    <MarketplaceAppContext.Provider value={{ appSdk, appConfig: null }}>
      <CustomFieldExtensionProvider>{children}</CustomFieldExtensionProvider>
    </MarketplaceAppContext.Provider>
  );
  return { ...render(<Wrap><Probe /></Wrap>), get ctx() { return ctx; } };
};

describe("CustomFieldExtensionProvider", () => {
  it("loads the stored value once via location.field.getData", async () => {
    const getData = vi.fn().mockResolvedValue({ value: 3 });
    const view = setup({ getData, setData: vi.fn() });
    await act(async () => {});
    expect(view.ctx.customField).toEqual({ value: 3 });
    expect(getData).toHaveBeenCalledOnce();
  });

  it("setFieldData persists through setData, then updates context", async () => {
    const order: string[] = [];
    const setData = vi.fn(async () => { order.push("setData"); });
    const view = setup({ getData: vi.fn().mockResolvedValue({ value: 1 }), setData });
    await act(async () => {});
    await act(async () => {
      await view.ctx.setFieldData({ value: 4.5 });
      order.push("done");
    });
    expect(setData).toHaveBeenCalledExactlyOnceWith({ value: 4.5 });
    expect(order).toEqual(["setData", "done"]);
    expect(view.ctx.customField).toEqual({ value: 4.5 });
  });

  it("does not update context when setData rejects", async () => {
    const setData = vi.fn().mockRejectedValue(new Error("nope"));
    const view = setup({ getData: vi.fn().mockResolvedValue({ value: 1 }), setData });
    await act(async () => {});
    await act(async () => {
      await expect(view.ctx.setFieldData({ value: 5 })).rejects.toThrow("nope");
    });
    expect(view.ctx.customField).toEqual({ value: 1 });
  });
});
