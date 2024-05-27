import { Locator, Page } from "@playwright/test";

export class Dialogs {
  readonly page: Page;
  readonly modalHeader: Locator;
  readonly modalBody: Locator;
  readonly closeSmallModalOk: Locator;
  readonly closeSmallModalCancel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalHeader = page.locator('.modal-header div');
    this.modalBody = page.locator('.modal-body');
    this.closeSmallModalOk = page.locator('#closeSmallModal-ok');
    this.closeSmallModalCancel = page.locator('#closeSmallModal-cancel');
  }

  async clickOkButtonInDeleteModal() {
    await this.closeSmallModalOk.click()
  }
}
