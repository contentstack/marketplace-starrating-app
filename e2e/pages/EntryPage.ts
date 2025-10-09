import { expect, FrameLocator, Locator, Page } from "@playwright/test";
import initParams from "../fixtures/initParams.json";

export class EntryPage {
  // Define selectors
  readonly page: Page;
  readonly entriesPage: Locator;
  readonly saveButton: Locator;
  readonly widgetLocator: Locator;

  // Initialize selectors using constructor
  constructor(page: Page) {
    this.page = page;
    this.entriesPage = page.locator('svg[name="Entries"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.widgetLocator = page.locator('svg[name="Widgets"]');
  }

  // Define methods

  // navigate to entry page
  async navigateToDashboard() {
    await this.page.goto(`/#!/stack/${process.env.STACK_API_KEY}/dashboard`);
    await this.page.waitForLoadState();
  }

  // navigate to entry page
  async navigateToEntry(apiKey: string, contentTypeUID: string, entryUID: string) {
    await this.page.goto(`/#!/stack/${apiKey}/content-type/${contentTypeUID}/en-us/entry/${entryUID}/edit`);
    await this.page.waitForLoadState();
  }

  // Widget selector on the entry page
  async widgetSelector() {
    await this.page.waitForSelector('svg[name="Widgets"]');
    await this.widgetLocator.click();
  }

  // Return iframe
  async accessFrame() {
    const elementHandle = await this.page.waitForSelector("div.cs-extension iframe");
    const frame = await elementHandle.contentFrame();
    return frame;
  }

  // Check for dashboard widget
  async validateDashboardWidget() {
    const frame = await this.accessFrame();
    await frame?.waitForSelector(".app-component-content");
    const locateText: any = await frame?.locator('text="Dashboard Widget"');
    const matchText = await locateText?.innerText();
    expect(matchText).toBe("Dashboard Widget");
  }

  // Check for entry custom field & entry side bar
  async ValidateColorPicker(appName: string) {
    await this.page.waitForTimeout(3000);

    const frame: FrameLocator = this.page.frameLocator(
      `iframe[title="${initParams.customFieldTitlePrefix}${appName}"]`
    );
    const colorPicker: Locator = frame.locator(".layout-container").first();
    await colorPicker.waitFor();
    await expect(colorPicker).toBeVisible();
  }
  async interactColorPicker() {
    const frame = await this.accessFrame();
    const colorPicker: Locator = frame!.locator(".layout-container .swatch").first();
    await colorPicker.waitFor();
    await expect(colorPicker).toBeVisible();
    await colorPicker.click(); // Click on the swatch to open the color picker popover
    const colorPickerPopover: Locator = frame!.locator(".layout-container .popover").first();
    await colorPickerPopover.waitFor();
    await expect(colorPickerPopover).toBeVisible();

    const hexInput: Locator = colorPickerPopover.locator("#rc-editable-input-1");
    await hexInput.waitFor();
    await expect(hexInput).toBeVisible();

    const RInput: Locator = colorPickerPopover.locator("#rc-editable-input-2");
    await RInput.waitFor();
    await expect(RInput).toBeVisible();

    const GInput: Locator = colorPickerPopover.locator("#rc-editable-input-3");
    await GInput.waitFor();
    await expect(GInput).toBeVisible();

    const BInput: Locator = colorPickerPopover.locator("#rc-editable-input-4");
    await BInput.waitFor();
    await expect(BInput).toBeVisible();

    const AInput: Locator = colorPickerPopover.locator("#rc-editable-input-5");
    await AInput.waitFor();
    await expect(AInput).toBeVisible();

    await hexInput.click();
    await hexInput.fill("A1F02E");

    const RValue: string = await RInput.inputValue();
    const GValue: string = await GInput.inputValue();
    const BValue: string = await BInput.inputValue();
    const AValue: string = await AInput.inputValue();

    expect(RValue).toBe("161");
    expect(GValue).toBe("240");
    expect(BValue).toBe("46");
    expect(AValue).toBe("100");
  }
}
