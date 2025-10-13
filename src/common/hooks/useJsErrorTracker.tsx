import { useCallback } from "react";

const ENV: string = process.env.NODE_ENV || "development";

/**
 * Returns functions to track errors manually
 * and set global data for all events
 */
export const useJSErrorTracking = () => {
  return {
    /**
     * Track an error manually
     * Skip tracking if env = development
     * but log the error to view in console
     */
    trackError: useCallback((_error: any) => {
      if (ENV === "development") {
        return;
      }
      // This used to track errors with Datadog. It is now a no-op.
    }, []),

    /**
     * Set global data to be sent with every error log
     * Use only global properties
     */
    setErrorsMetaData: useCallback((_properties: { [key: string]: string }) => {
      // This is a no-op now that Datadog is removed.
    }, []),
  };
};
