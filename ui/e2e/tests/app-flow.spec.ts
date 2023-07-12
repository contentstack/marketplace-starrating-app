import { test } from '@playwright/test';

import { createContentType, createEntry, createApp, updateApp, installApp, uninstallApp, deleteApp, deleteContentType, entryPageFlow, initializeEntry, getExtensionFieldUid } from '../utils/helper';

const jsonFile = require('jsonfile');

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
  appName: string;
}

//setting up the test data for entry page actions
test.beforeAll(async () => {
  const file = 'data.json';
  const token = jsonFile.readFileSync(file);
  authToken = token.authToken;
  try {
    if (authToken) {
      const appId: string = await createApp(authToken);
      const { name: appName } = await updateApp(authToken, appId);
      savedCredentials['appName'] = appName;
      const installationId: string = await installApp(authToken, appId, process.env.STACK_API_KEY);
      const extensionUid = await getExtensionFieldUid(authToken);
      const contentTypeResp = await createContentType(authToken, extensionUid);
      savedCredentials['contentTypeId'] = extensionUid ? contentTypeResp.content_type.uid : undefined;
      if (contentTypeResp.notice === 'Content Type created successfully.') {
        const entryResp = await createEntry(authToken, contentTypeResp.content_type.uid);
        savedCredentials['entryUid'] = entryResp.entry.uid;
        savedCredentials['entryTitle'] = entryResp.entry.title;
        savedCredentials['appId'] = appId;
        savedCredentials['installationId'] = installationId;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
});

//tearing down of test data
test.afterAll(async () => {
  const addParams: TestData = savedCredentials;
  if (addParams.installationId) await uninstallApp(authToken, addParams.installationId);
  await deleteApp(authToken, addParams.appId);
  if (addParams.contentTypeId) {
    await deleteContentType(authToken, addParams.contentTypeId);
  } else {
    throw new Error('Content Type not created');
  }
});

test('#1 Validate Star Rating', async ({ page, context }) => {
  const { appName } = savedCredentials;
  const entryPage = await initializeEntry(page);
  await entryPageFlow(savedCredentials, entryPage);
  await entryPage.validateCustomField(appName);
  await entryPage.validateChangeRating(appName);
});

