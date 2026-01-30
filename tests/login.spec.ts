import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test('User can login successfully', async ({page}) => {
    const loginPage = new LoginPage(page);

    await page.goto('https://conduit.bondaracademy.com/login');

    await loginPage.login(

    'Sakismafia122@mail.com', 
    'Password123!'
    );

    const signInButton = page.getByRole('button', {name: 'Sign in'});
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

    const profileLink = page.getByRole('link', { name: 'Sakimafia122' });
    await expect(profileLink).toHaveAttribute('href', '/profile/Sakimafia122');
})