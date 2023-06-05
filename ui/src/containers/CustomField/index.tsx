import React, { useEffect, useState } from "react";

import ContentstackAppSdk from "@contentstack/app-sdk";
import { isEmpty } from "lodash";
import { Rating } from "react-simple-star-rating";

import { TypeSDKData, TypeStarRatingData } from "../../common/types";
import constants from "../../common/constants";
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

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
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
    });
  }, []);

  const onChangeSave = (ratings: number) => {
    console.info("ratings");
    console.info(ratings);
    setRatingValue({ value: ratings });
    console.info(state);
    // const dummy = state.location?.CustomField?.field;
    /* eslint-disable */
    state.location?.CustomField?.field?.setData({ value: ratings / 20 });
    // state.location?.CustomField?.field?.setData({ value: ratings / 20 });
    /* eslint-enable */
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
