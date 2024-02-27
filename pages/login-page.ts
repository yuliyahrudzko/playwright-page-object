import { Locator, Page} from '@playwright/test';


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

  //Imperative: 
  async enterUsername(username: string) {
    await this.userName.fill(username);
  }

  async enterPassword(password: string) {
    await this.password.fill(password);
  }

  async clickLogin() {
    await this.loginBtn.click();
  }

  async login(username: string, password: string) {
    await this.enterPassword(username);
    await this.enterUsername(password);
    await this.clickLogin();
  }
}
