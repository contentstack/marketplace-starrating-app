/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { useContext } from "react";
import {
  MarketplaceAppContext,
  MarketplaceAppContextType,
} from "../contexts/marketplaceContext";

/**
 * Getter for appSdk instance.
 * To be used during SDK initialization
 * @returns appSdk;
 *
 * Eg:
 * const appSdk = useAppSdk();
 */
export const useAppSdk = () => {
  const { appSdk } = useContext(
    MarketplaceAppContext
  ) as MarketplaceAppContextType;
  return appSdk;
};
