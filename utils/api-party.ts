import { Page } from "@playwright/test";

export class ApiParty {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async blockImage() {
    await this.page.route(/.(png|jpeg|img)$/, route => route.abort());
  }

  async createPromiseForBooksRequest() {
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

  async getUserInfoRequest(userID: string, token: string) {
    return await this.page.request.get(`/Account/v1/User/${userID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async addBooksToUserProfile(userID: string, token: string, arrayOfBooksNumbers, listOfBooks: object) {
    for (let i = 0; i < arrayOfBooksNumbers.length; i++) {
      await this.page.request.post('/BookStore/v1/Books', {
        headers: {
          'Authorization':  `Bearer ${token}`
        },
        data: {
          'userId': userID,
          'collectionOfIsbns': [
            {
              'isbn': listOfBooks[arrayOfBooksNumbers[i]].isbn
            }
          ]
        }
      });
    }
  }
}
