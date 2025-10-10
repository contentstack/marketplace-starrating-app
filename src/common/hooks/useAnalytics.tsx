import { useCallback } from "react";
import { useAppSdk } from "./useAppSdk";

const ENV: string = process.env.NODE_ENV || "development";
/**
 * Initialize Heap
 */

type AnalyticsApi = { trackEvent: Function };

/**
 * useAnalytics hook to track user actions and events in application
 */
export const useAnalytics = (): AnalyticsApi => {
  const appSDK = useAppSdk();
  const trackEvent = useCallback(
    (event: string, eventData: { [key: string]: string } = {}) => {
      // skip tracking if env is development
      if (ENV === "production") {
        appSDK?.pulse(event, eventData);
      }
    },
    [appSDK]
  );

  return { trackEvent };
};
