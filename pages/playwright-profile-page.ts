import { Locator, Page } from "@playwright/test";

export class PlaywrightProfilePage {
  readonly page: Page;
  readonly goToStore: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToStore = page.locator('#gotoStore');
  }

  async blockImage() {
    await this.page.route(/.(png|jpeg|img)$/, route => route.abort());
  }

  async triggerGetRequest() {
    await this.goToStore.click();
  }
}
