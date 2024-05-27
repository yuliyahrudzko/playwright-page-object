import { Locator, Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly goToStore: Locator;
  readonly deleteIcon: Locator;
  readonly deleteAllBooksButton: Locator;
  readonly bookTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToStore = page.locator('#gotoStore');
    this.deleteIcon = page.locator('.rt-tbody #delete-record-undefined');
    this.deleteAllBooksButton = page.locator('.buttonWrap div:nth-of-type(3) button').filter({ hasText: 'Delete All Books' });
    this.bookTitle = page.locator('.rt-tbody > div a');

  }

  async clickGoToStoreButton() {
    await this.goToStore.click();
  }

  async clickDeleteIcon(index) {
    await this.deleteIcon.nth(index).click()
  }

  async clickDeleteAllBooksButton() {
    await this.deleteAllBooksButton.click();
  }
}
