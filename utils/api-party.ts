import { Page } from "@playwright/test";

export class ApiParty { //переименовать
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async blockImage() {
    await this.page.route(/.(png|jpeg|img)$/, route => route.abort());
  }

  async createPromise() {
    return this.page.waitForResponse('/BookStore/v1/Books')
  }

  async changeNumberOfPages(count) {
    this.page.route('/BookStore/v1/Book?**', async route => {
      const response = await route.fetch();
      let body = await response.text();

      body = body.replace(await response.json().then(data => data.pages), count);
      route.fulfill({
        response,
        body
      });
    });
  }
}
