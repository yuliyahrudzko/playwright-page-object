import { Locator, Page, BrowserContext} from '@playwright/test';
import { username, password } from '../fixtures/users.json';

export class PlaywrightLoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly userId: Locator;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('#login');
    this.context = context;
  }

  async goto() {
    await this.page.goto('https://demoqa.com/login');
  }

  async enterUsername() {
    await this.userName.fill(username);
  }

  async enterPassword() {
    await this.password.fill(password);
  }

  async clickLogin() {
    await this.loginBtn.click();
  }

  async login() {
    await this.enterPassword();
    await this.enterUsername();
    await this.clickLogin();
  }

  async getCookies() {
    const cookies = this.context.cookies('https://demoqa.com/');
    
    return cookies;
  }

  async getUserID() {
    const userID = (await this.getCookies()).find(c => c.name === 'userID')?.value;

    return userID;
  }

  async getUserName() {
    const userName = (await this.getCookies()).find(c => c.name === 'userName')?.value;

    return userName;
  }

  async getToken() {
    const token = (await this.getCookies()).find(c => c.name === 'token')?.value;

    return token;
  }

  async getExpiresCookie() {
    (await this.getCookies()).find(c => c.name === 'expires')?.value;
  }
}
