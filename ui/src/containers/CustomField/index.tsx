import React, { useEffect, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { isEmpty, get } from "lodash";
import { Rating } from "react-simple-star-rating";
import { TypeSDKData } from "../../common/types";
import constants, { eventNames } from "../../common/constants";
import "./styles.scss";
import getAppLocation from "../../common/functions";
import useJsErrorTracker from "../../common/hooks/useJsErrorTracker";
import { useAppSdk } from "../../common/hooks/useAppSdk";

const CustomField: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  // error tracking hooks
  const { setErrorsMetaData, trackError } = useJsErrorTracker();
  const [, setRatingValue] = useState<number>(0);
  const { APP_INITIALIZE_SUCCESS } = eventNames;
  const [, setAppSdk] = useAppSdk();
  
  const ENV: string = process.env.NODE_ENV || "";

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        setAppSdk(appSdk);
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
         
        const appLocation: string = getAppLocation(appSdk);
        const properties = {
          Stack: appSdk?.stack._data.api_key,
          Organization: appSdk?.currentUser.defaultOrganization,
          "App Location": appLocation,
          "User Id": get(appSdk, "stack._data.collaborators.0.uid", ""), // first uuid from collaborators
        };
        setErrorsMetaData(properties); // set global event data for errors
         if (ENV === "production") {
          appSdk?.pulse(APP_INITIALIZE_SUCCESS,properties);
        }
      })
      .catch((error) => {
        trackError(error);
        console.error(constants.appSdkError, error);
        
      });
  }, []);

  const onChangeSave = (ratings: number) => {
    setRatingValue(ratings);
    state.location?.CustomField?.field?.setData(ratings/20);
  };

 const ratingValue = state.location?.CustomField?.field?.getData();
 const computedRatingValue = ratingValue !== undefined ? ratingValue * 20 : 0;

return (
  <div className="layout-container">
    {state.appSdkInitialized && (
      <Rating
        showTooltip
        allowHalfIcon
        ratingValue={computedRatingValue}
        onClick={onChangeSave}
        fillColorArray={constants.fillColorArray}
      />
    )}
  </div>
);


};

export default CustomField;
