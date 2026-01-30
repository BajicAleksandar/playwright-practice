import { Page } from '@playwright/test';

export class SignupPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://conduit.bondaracademy.com/register');
  }

  async signUp(username: string, email: string, password: string){

    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
  }
}