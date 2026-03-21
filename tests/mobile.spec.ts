import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { LogoutPage } from '../Pages/LogoutPage';

test('@smoke open menu depending on device', async ({page}, testInfo) => {
        await page.goto('https://demoqa.com/')

        if(testInfo.project.use.isMobile){
            await page.getByRole('link', {name: 'Elements'}).click();
            await page.locator('div.header-text', {hasText: 'Elements'}).click();

            await expect (page.locator('.element-list')).toBeVisible();
            await expect(page.locator('ul.menu-list')).toBeVisible();
        } else {
            await page.getByRole('link', { name: 'Elements' }).click();
            
            await expect(page.getByText('Please select an item from left to start practice.')).toBeVisible();
        }
        
    });