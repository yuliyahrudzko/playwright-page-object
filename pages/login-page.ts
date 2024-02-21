import { Locator, Page} from '@playwright/test';
import { username, password } from '../fixtures/users.json';

export class LoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('#login');
  }

  async goto() {
    await this.page.goto('/login');
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
}
