import { test } from "@playwright/test";
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  createContentType,
  createEntry,
  createApp,
  updateApp,
  installApp,
  uninstallApp,
  deleteApp,
  deleteContentType,
  entryPageFlow,
  initializeEntry,
  getExtensionFieldUid,
} from "../utils/helper";

const jsonFile = require("jsonfile");

let randomTestNumber = Math.floor(Math.random() * 1000);

let savedCredentials: any = {};
let authToken: string;

interface TestData {
  appId: string;
  contentTypeId: Object | any;
  installationId: string;
  authToken: string;
  entryTitle: string;
  environment: string;
  stackDetails: any;
  assetId: string;
}

//setting up the test data for entry page actions
test.beforeAll(async () => {
  const file = "data.json";
  const token = jsonFile.readFileSync(file);
  authToken = token.authToken;
  try {
    if (authToken) {
      const { appId, appName } = await createApp(authToken, randomTestNumber);

      savedCredentials["appName"] = appName;

      savedCredentials["appId"] = appId;
      const appUpdated = await updateApp(authToken, appId, appName);
      const installationId: string = await installApp(authToken, appId, process.env.STACK_API_KEY);
      savedCredentials["installationId"] = installationId;
      const extensionUid = await getExtensionFieldUid(authToken);
      const contentTypeResp = await createContentType(authToken, appName, extensionUid);
      if (contentTypeResp.notice === "Content Type created successfully.") {
        savedCredentials["contentTypeId"] = contentTypeResp.content_type.uid;
        const entryResp = await createEntry(authToken, appName, contentTypeResp.content_type.uid);
        savedCredentials["entryUid"] = entryResp.entry.uid;
        savedCredentials["entryTitle"] = entryResp.entry.title;
        savedCredentials["appId"] = appId;
        savedCredentials["installationId"] = installationId;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
});

//tearing down of test data
test.afterAll(async () => {
  await uninstallApp(authToken, savedCredentials.installationId);
  await deleteApp(authToken, savedCredentials.appId);

  await deleteContentType(authToken, savedCredentials.contentTypeId);
});

test("#1 Validate Color Picker", async ({ page, context }) => {
  const { appName } = savedCredentials;
  const entryPage = await initializeEntry(page);
  await entryPageFlow(savedCredentials, entryPage);
  await entryPage.ValidateColorPicker(appName);
  await entryPage.interactColorPicker();
});
