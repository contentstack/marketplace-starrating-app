const constants: any = {
  fillColorArray: [
    "#f17a45", // The color of stars when rating value is 1
    "#f19745", // The color of stars when rating value is 2
    "#f1a545", // The color of stars when rating value is 3
    "#f1b345", // The color of stars when rating value is 4
    "#f1d045", // The color of stars when rating value is 5
  ],
};

export const eventNames = Object.freeze({
  APP_INITIALIZE_SUCCESS: "App Loaded Successfully",
  APP_INITIALIZE_FAILURE: "App Load Failure",
});

export default constants;
