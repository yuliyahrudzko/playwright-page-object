import { Locator, Page } from "@playwright/test";

export class PlaywrightBooksPage {
  readonly page: Page;
  readonly goToStore: Locator;
  readonly booksCountOnUi: Locator;
  readonly bookNumber: Locator;

  constructor (page: Page) {
    this.page = page;
    this.goToStore = page.locator('#gotoStore');
    this.booksCountOnUi = page.locator('.rt-tbody>div img');
  }

  async createPromise() {
    return this.page.waitForResponse(response =>
      response.url() === 'https://demoqa.com/BookStore/v1/Books' && response.status() === 200
    );
  }

  async triggerGetRequest() {
    await this.goToStore.click();
  }

  async makeScreenshot(){
    await this.page.screenshot( { path: 'screenshot.png' } );
  }

  async getNumberOfBooksInResponse() {
    (await this.createPromise()).json().then(data => {
      return data.books.length;
    });
  }

  async getNumberOfBooksOnUi() {
    return await this.booksCountOnUi.count();
  }

  async changeNumberOfPages() {
    const newPageCount = String(Math.floor(Math.random() * (1000 - 1) + 1));

    //page.route() to mock network in a single page.
    this.page.route('https://demoqa.com/BookStore/v1/Book?**', async route => {
      //Fetch original response.
      const response = await route.fetch();
      let body = await response.text();

      body = body.replace(await response.json().then(data => data.pages), newPageCount);
      route.fulfill({
        //Pass all fields from the response.
        response,
        //Override response body.
        body
      });
    });
  }
/*
  async verifyInfoInAccountRequest() {

    const response = await page.request.get(`https://demoqa.com/Account/v1/User/${USERID}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
        
    expect(await response.json().then(data => data.username)).toEqual(USERNAME);
        
    expect(await response.json().then(data => data.books.length)).toBe(0);
  }
*/
}