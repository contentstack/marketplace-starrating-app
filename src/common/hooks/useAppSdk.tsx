/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { atom, useAtom } from "jotai";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";

export const appSdkRefAtom = atom<UiLocation | null>(null);

/**
 * Getter and setter for appSdk instance.
 * To be used during Sdk initialisation
 */
export const useAppSdk = (): [UiLocation | null, Function] => useAtom(appSdkRefAtom);
