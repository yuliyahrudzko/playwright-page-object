import { Locator, Page } from "@playwright/test";

export class PlaywrightBooksPage {
  readonly page: Page;
  readonly booksCountOnUi: Locator;
  //readonly bookToOpen: Locator;

  constructor (page: Page) {
    this.page = page;
    this.booksCountOnUi = page.locator('.rt-tbody>div img');
    //this.bookToOpen = page.locator(`.rt-tbody>div:nth-child(${bookNumber}) a`)
  }

  async createPromise() {
    return this.page.waitForResponse(response =>
      response.url() === 'https://demoqa.com/BookStore/v1/Books' && response.status() === 200
    );
  }

  async makeScreenshot(){
    await this.page.screenshot( { path: 'screenshot.png' } );
  }

  async getNumberOfBooksInResponse(booksResponse) { //можно ли использовать параметры в page файлах при создании методов???
    return await booksResponse.json().then(data => { 
      return data.books.length;
    });
  }

  async getNumberOfBooksOnUi() {
    return await this.booksCountOnUi.count();
  }

  async changeNumberOfPages(newPageCount) {
    this.page.route('https://demoqa.com/BookStore/v1/Book?**', async route => {
      const response = await route.fetch();
      let body = await response.text();

      body = body.replace(await response.json().then(data => data.pages), newPageCount);
      route.fulfill({
        response,
        body
      });
    });
  }

  async getResponse(userID, token) { //можно ли использовать параметры в page файлах при создании методов???
    return await this.page.request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getUserName(response) { //можно ли использовать параметры в page файлах при создании методов???
    return await response.json().then(data => data.username);
  }

  async getBookLength(response) { //можно ли использовать параметры в page файлах при создании методов???
    return await response.json().then(data => data.books.length);
  } 
/*
  async openBook() {
    await this.bookToOpen.click();
    
    await this.page.screenshot({ path: 'BookContext.png' });  
  }

  async verifyNewNumberOfPages() {

  }
  */
}