import { Page } from "@playwright/test";

export class FormHelper {
  readonly page: Page;

  constructor (page: Page) {
    this.page = page;
  }

  async makeScreenshot(name: string){
    await this.page.screenshot( { path: name } );
  }

  async generateRandom(min: number, max: number){
    return String(Math.floor(Math.random() * (max - min)) + min);
  }

  async getResponse(userID: string, token: string) { //или в апи?
    return await this.page.request.get(`https://demoqa.com/Account/v1/User/${userID}`, { //добавить url в config
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

}