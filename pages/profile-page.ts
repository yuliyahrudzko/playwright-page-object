import { Locator, Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly goToStore: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToStore = page.locator('#gotoStore');
  }

  async clickGoToStoreButton() {
    await this.goToStore.click();
  }
}
