import React from "react";
import { datadogRum } from "@datadog/browser-rum";

interface MyProps {
  children: any;
}

interface MyState {
  hasError: boolean;
}

const {
  REACT_APP_DATADOG_RUM_APPLICATION_ID: applicationId,
  REACT_APP_DATADOG_RUM_CLIENT_TOKEN: clientToken,
  REACT_APP_DATADOG_RUM_SITE: site,
  REACT_APP_DATADOG_RUM_SERVICE: service,
} = process.env;

datadogRum.init({
  applicationId: `${applicationId}`,
  clientToken: `${clientToken}`,
  site: `${site}`,
  service: `${service}`,
  sampleRate: 100,
  sessionReplaySampleRate: 20,
  trackInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  useCrossSiteSessionCookie: true,
});

datadogRum.setGlobalContextProperty("Application Type", "Marketplace");
datadogRum.setGlobalContextProperty("Application Name", "Star Rating App");

class ErrorBoundary extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    console.warn(error); // Remove this line if not required.
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    // You can also log the error to an error reporting service
    datadogRum.addError(error);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;
