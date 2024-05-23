/*eslint-disable @typescript-eslint/no-explicit-any */
import { Page } from "@playwright/test";

export class FormHelper {
  readonly page: Page;
  readonly array: any[] = [];

  constructor (page: Page) {
    this.page = page;
  }

  //Actor
  async goto(path: string) {
    await this.page.goto(path);
  }

  async makeScreenshot(name: string){
    await this.page.screenshot( { path: name } );
  }

  async generateRandom(min: number, max: number){
    return String(Math.floor(Math.random() * (max - min)) + min);
  }
}
