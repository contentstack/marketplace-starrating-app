import React, { useEffect, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { isEmpty, get } from "lodash";
import { Rating } from "react-simple-star-rating";

import { TypeSDKData, StarRatingDataType } from "../../common/types";
import getAppLocation from "../../common/functions";
import { useJSErrorTracking } from "../../common/hooks/useJsErrorTracker";
import constants, { eventNames } from "../../common/constants";

import "./styles.scss";

const CustomField: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  // error tracking hooks
  const { setErrorsMetaData, trackError } = useJSErrorTracking();
  const [, setRatingValue] = useState<StarRatingDataType>({ value: 0 });
  const { APP_INITIALIZE_SUCCESS } = eventNames;

  const ENV: string = process.env.NODE_ENV || "";

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const config = await appSdk?.getConfig();

        setState({
          config,
          location: appSdk.location,
          appSdkInitialized: true,
        });

        const initialData = appSdk.location?.CustomField?.field?.getData() || {};

        if (!isEmpty(initialData)) {
          setRatingValue(initialData as StarRatingDataType);
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
          appSdk?.pulse(APP_INITIALIZE_SUCCESS, {
            property: "App loaded Successfully",
            app_name: "Star Ratings",
            app_location: "CustomField",
          });
        }
      })
      .catch((error) => {
        trackError(error);
        console.error(constants.appSdkError, error);
      });
  }, []);

  const onChangeSave = async (ratings: number) => {
    const selectedRating = ratings / 20;
    try {
      if (state.location?.CustomField?.field) {
        await state.location.CustomField.field.setData({ value: selectedRating });
      } else {
        console.error("Something went wrong while saving data.");
      }
    } catch (error) {
      console.error("Error occurred while saving data:", error);
    }
  };

  const ratingValue = state.location?.CustomField?.field?.getData();
  const computedRatingValue = ratingValue !== undefined ? ratingValue.value * 20 : 0;

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
