import React, { useEffect, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { isEmpty, get } from "lodash";
import { Rating } from "react-simple-star-rating";
import { TypeSDKData } from "../../common/types";
import constants, { eventNames } from "../../common/constants";
import useAnalytics from "../../common/hooks/useAnalytics";
import "./styles.scss";
import getAppLocation from "../../common/functions";
import useJsErrorTracker from "../../common/hooks/useJsErrorTracker";

const CustomField: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  // error tracking hooks
  const { setErrorsMetaData, trackError } = useJsErrorTracker();
  const [, setRatingValue] = useState<number>(0);
  const { trackEvent } = useAnalytics();
  const { APP_INITIALIZE_SUCCESS, APP_INITIALIZE_FAILURE } = eventNames;

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const config = await appSdk?.getConfig();

        setState({
          config,
          location: appSdk.location,
          appSdkInitialized: true,
        });

        const initialData = appSdk.location?.CustomField?.field?.getData();

        if (!isEmpty(initialData)) {
          setRatingValue(initialData);
        }

        trackEvent(APP_INITIALIZE_SUCCESS);
        const appLocation: string = getAppLocation(appSdk);
        const properties = {
          Stack: appSdk?.stack._data.api_key,
          Organization: appSdk?.currentUser.defaultOrganization,
          "App Location": appLocation,
          "User Id": get(appSdk, "stack._data.collaborators.0.uid", ""), // first uuid from collaborators
        };
        setErrorsMetaData(properties); // set global event data for errors
      })
      .catch((error) => {
        trackError(error);
        console.error(constants.appSdkError, error);
        trackEvent(APP_INITIALIZE_FAILURE);
      });
  }, []);

  const onChangeSave = (ratings: number) => {
    setRatingValue(ratings);

    state.location?.CustomField?.field?.setData(ratings);
  };

  return (
    <div className="layout-container">
      {state.appSdkInitialized && (
        <Rating
          showTooltip
          allowHalfIcon
          ratingValue={state.location?.CustomField?.field?.getData()}
          onClick={onChangeSave}
          fillColorArray={constants.fillColorArray}
        />
      )}
    </div>
  );
};

export default CustomField;
