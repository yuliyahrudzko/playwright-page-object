import { Locator, Page, BrowserContext} from '@playwright/test';
import { username, password } from '../fixtures/users.json';

export class PlaywrightLoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
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
    return await this.context.cookies('https://demoqa.com/');
  }

  async getUserID() {
    return (await this.getCookies()).find(c => c.name === 'userID')?.value;
  }

  async getUserName() {
    return (await this.getCookies()).find(c => c.name === 'userName')?.value;
  }

  async getToken() {
    return (await this.getCookies()).find(c => c.name === 'token')?.value;
  }

  async getExpiresCookie() {
    return (await this.getCookies()).find(c => c.name === 'expires')?.value;
  }
}
