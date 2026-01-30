import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test.describe('Login', () => {

    let userEmail = 'Sakismafia122@mail.com';
    let userPassword = 'Password123!';

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        await page.goto('https://conduit.bondaracademy.com/login');
        await loginPage.login(userEmail, userPassword);

    const signInButton = page.getByRole('button', {name: 'Sign in'});
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

    await page.getByRole('link', { name: 'Sakimafia122' }).waitFor();
    });

    test('Profile is visible', async ({page}) => {
        await expect(page.getByRole('link', {name: 'Sakimafia122'})).toBeVisible();
    })

});