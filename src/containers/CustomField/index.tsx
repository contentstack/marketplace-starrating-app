import React from "react";
import { Rating } from "react-simple-star-rating";

import { useCustomField } from "../../common/hooks/useCustomField";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { StarRatingDataType } from "../../common/types";
import constants from "../../common/constants";

import "./styles.scss";

const CustomField: React.FC = function () {
  const [customField, setFieldData] = useCustomField();
  const appSdk = useAppSdk();
  console.log("appSdk", appSdk);

  const onChangeSave = async (ratings: number) => {
    const selectedRating = ratings / 20;
    try {
      if (setFieldData) {
        await setFieldData({ value: selectedRating });
      } else {
        console.error("Something went wrong while saving data.");
      }
    } catch (error) {
      console.error("Error occurred while saving data:", error);
    }
  };

  const ratingValue = customField as StarRatingDataType;
  const computedRatingValue = ratingValue?.value ? ratingValue.value * 20 : 0;

  return (
    <div className="layout-container">
      {appSdk && (
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
