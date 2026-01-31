import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test.describe('Logged in user tests', () => {

    let userEmail = 'Sakismafia122@mail.com';
    let userPassword = 'Password123!';
    let username = 'Sakimafia122';

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
        await expect(page.getByRole('link', {name: username})).toBeVisible();
    })

    test('My feed', async ({page}) => {
        await page.getByText(' Your Feed ').click()

        await expect(page.getByText('No articles are here... yet.')).toBeVisible();
    })

    test('Logout and login with wrong password', async ({page}) => {
        await page.getByRole('link', {name: username}).click();

        await expect(page.locator('a', {hasText: ' Edit Profile Settings '})).toBeVisible();

        await page.locator('a', {hasText: ' Edit Profile Settings '}).click();

        await expect(page).toHaveURL('https://conduit.bondaracademy.com/settings');

        //Logout
        await page.getByRole('button', {name: ' Or click here to logout. '}).click();

        await expect(page.locator('a', {hasText: ' Sign in '})).toBeVisible();

        //SignIn page
        await page.locator('a', {hasText: ' Sign in '}).click();
        await expect(page).toHaveURL('https://conduit.bondaracademy.com/login');

        const signinPage = new LoginPage(page);
        await signinPage.login('wrong@mail.com', 'wrong123')
        await page.getByRole('button', {name: 'Sign in'}).click();

        await expect(page.locator('li', {hasText: 'email or password is invalid'})).toBeVisible();
    })

});