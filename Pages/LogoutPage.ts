import { Page, expect } from '@playwright/test';

export class LogoutPage {
    constructor(private page: Page) {}

    async logout(username: string){

        await this.page.getByRole('link', {name: username}).click();
        await this.page.locator('a', {hasText: /Edit Profile Settings/i}).click();
        await this.page.getByRole('button', {name: /Or click here to logout./i}).click();
    }
}