import { test, expect } from '@playwright/test';
import { SignupPage } from '../Pages/SignupPage';

test('User can sign up successfully', async ({ page }) => {
  const signupPage = new SignupPage(page);

  await signupPage.open();

  await signupPage.signUp(
    'Sakimafia122',
    'Sakismafia122@mail.com', 
    'Password123!'
  );

  const signUpButton = page.getByRole('button', {name: 'Sign up'});
  await expect(signUpButton).toBeEnabled();
  await signUpButton.click();

  // Provera uspešne registracije
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
});
