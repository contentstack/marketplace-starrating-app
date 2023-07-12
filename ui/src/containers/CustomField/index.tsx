import React, { useEffect, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { isEmpty } from "lodash";
import { Rating } from "react-simple-star-rating";
import { TypeSDKData, TypeStarRatingData } from "../../common/types";
import constants, { eventNames } from "../../common/constants";
import useAnalytics from "../../common/hooks/useAnalytics";
import "./styles.scss";

const CustomField: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  const [ratingValue, setRatingValue] = useState<TypeStarRatingData>({
    value: 0,
  });
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

      if (initialData && !isEmpty(initialData) && initialData.value) {
        setRatingValue({ value: initialData.value * 20 });
      }
      
      trackEvent(APP_INITIALIZE_SUCCESS);
    })
    .catch((error) => {
      console.error(constants.appSdkError, error); 
      trackEvent(APP_INITIALIZE_FAILURE);
    });
}, []);


  const onChangeSave = (ratings: number) => {
    setRatingValue({ value: ratings });
    state.location?.CustomField?.field?.setData({ value: ratings / 20 });
  };

  return (
    <div className="layout-container">
      {state.appSdkInitialized && (
        <Rating
          showTooltip
          allowHalfIcon
          ratingValue={ratingValue.value}
          onClick={onChangeSave}
          fillColorArray={constants.fillColorArray}
        />
      )}
    </div>
  );
};

export default CustomField;
