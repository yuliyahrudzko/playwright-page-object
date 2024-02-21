import { Locator, Page } from "@playwright/test";

export class BooksListPage {
  readonly page: Page;
  readonly booksCountOnUi: Locator;

  constructor (page: Page) {
    this.page = page;
    this.booksCountOnUi = page.locator('.rt-tbody>div img');
  }

  async getNumberOfBooksOnUi() {
    return await this.booksCountOnUi.count();
  }

  async openBook(number) {
    await this.page.locator(`.rt-tbody>div:nth-child(${number}) a`).click();
  }


}