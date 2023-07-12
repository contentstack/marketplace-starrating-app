import { datadogRum } from "@datadog/browser-rum";

const ENV: string = process.env.NODE_ENV || "";

const useJsErrorTracker = () => {
  const trackError = (error: any) => {
    if (ENV === "development") {
      return;
    }
    datadogRum.addError(error);
  };

  const setErrorsMetaData = (key: string, value: any) => {
    datadogRum.setGlobalContextProperty(key, value);
  };
  return { trackError, setErrorsMetaData };
};

export default useJsErrorTracker;
