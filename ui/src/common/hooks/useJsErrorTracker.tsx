import { datadogRum } from "@datadog/browser-rum";
import { useCallback } from "react";
import { each } from "lodash";

const ENV: string = process.env.NODE_ENV;

/**
 * Returns functions to track errors manually
 * and set global data for all events
 */
const useJSErrorTracking = () => {
  return {
    /**
     * Track an error manually
     * Skip tracking if env = development
     * but log the error to view in console
     */
    trackError: useCallback((error: any) => {
      if (ENV === "development") {
        return;
      }
      // error tracking by dataDog RUM
      datadogRum.addError(error);
    }, []),

    /**
     * Set global data to be sent with every error log
     * Use only global properties
     */
    setErrorsMetaData: useCallback((properties: { [key: string]: string }) => {
      each(properties, (key: string, value: string) => {
        datadogRum.setGlobalContextProperty(value, key);
      });
    }, []),
  }
};

export default useJSErrorTracking;