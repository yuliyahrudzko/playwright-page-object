import {Page} from '@playwright/test';
import authInfo from '../playwright/.auth/user.json'
export class GetCookies {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getCookieByName(name: string) {
    return authInfo.cookies.find(c => c.name === name)?.value;
  }

  async getUserID() {
    return this.getCookieByName('userID');
  }

  async getUserName() {
    return this.getCookieByName('userName');
  }

  async getToken() {
    return this.getCookieByName('token');
  }

  async getExpires() {
    return this.getCookieByName('expires');
  }
}
