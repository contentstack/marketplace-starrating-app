import { useCallback } from "react";
import { useAppSdk } from "./useAppSdk";

const ENV: string = process.env.NODE_ENV || "";

/**
 * useAnalytics hook to track user actions and events in application
 */
const useAnalytics = () => {
  const [appSDK] = useAppSdk();
  const trackEvent = useCallback(
    (event: string, eventData: any = {}) => {
      if (ENV === "production") {
        appSDK?.pulse(event, eventData);
      }
    },
    [appSDK]
  );

  return { trackEvent };
};

export default useAnalytics;