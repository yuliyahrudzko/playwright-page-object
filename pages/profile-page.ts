import { Locator, Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly goToStore: Locator;
  readonly deleteIcon: Locator;
  readonly okButton: Locator;
  readonly deleteAllBooksButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToStore = page.locator('#gotoStore');
    this.deleteIcon = page.locator('.rt-tbody > div:nth-of-type(2) #delete-record-undefined');
    this.okButton = page.locator('#closeSmallModal-ok');
    this.deleteAllBooksButton = page.locator('.buttonWrap div:nth-of-type(3) button').filter({ hasText: 'Delete All Books' });
  }

  async clickGoToStoreButton() {
    await this.goToStore.click();
  }

  async clickDeleteIcon() {
    await this.deleteIcon.click()
  }

  async clickOkButtonInDeleteModal() {
    await this.okButton.click()
  }

  async clickDeleteAllBooksButton() {
    await this.deleteAllBooksButton.click();
  }

}
