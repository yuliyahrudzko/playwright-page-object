import { Page } from "@playwright/test";

export class PlaywrightProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async blockImage() {
    await this.page.route(/.(png|jpeg|img)$/, route => route.abort());
  }
}
