import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { get, isEmpty, keys } from "lodash";

function getAppLocation(sdk: UiLocation): string {
  const locations = keys(sdk?.location);
  let locationName = "";
  for (let i = 0; i <= locations.length; i += 1) {
    if (!isEmpty(get(sdk, `location.${locations[i]}`, undefined))) {
      locationName = locations[i];
      break;
    }
  }
  return locationName;
}

export default getAppLocation;
