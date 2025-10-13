import React from "react";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { KeyValueObj } from "../types";

export type MarketplaceAppContextType = {
  appSdk: UiLocation | null;
  appConfig: KeyValueObj | null;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
    appSdk: null,
    appConfig: null,
  });
