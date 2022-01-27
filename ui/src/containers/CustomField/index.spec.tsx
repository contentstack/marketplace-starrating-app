import React from "react";
import { render, waitFor } from "@testing-library/react/pure";
import CustomField from "./index";

const elementsToTest = [".layout-container", ".react-simple-star-rating"];
let customFieldDom: any;
beforeAll(async () => {
  customFieldDom = render(<CustomField />);
});

describe(`UI Elements of Custom Field Screen`, () => {
  elementsToTest.forEach(e => {
    test(`Testing ${e} element`, async () => {
      await expect(
        waitFor(() =>
          customFieldDom?.container.querySelector()
        )
      ).toBeTruthy();
    });
  });
});
