import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { LogoutPage } from '../Pages/LogoutPage';

test.describe('Logged in user tests', () => {

    let userEmail = 'Sakismafia122@mail.com';
    let userPassword = 'Password123!';
    let username = 'Sakimafia122';

    //Articles
    const title = 'Novak Djokovic je sampion';
    const description = 'Sampion tenisa i direktor univerzuma';
    const tags = 'Tennis';
    const content = "Новак Ђоковић српски је тенисер. На првом месту АТП листе је провео 428 недеља што је најдужи период у историји отворене ере.";

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        await page.goto('https://conduit.bondaracademy.com/login');
        await loginPage.login(userEmail, userPassword);

    const signInButton = page.getByRole('button', {name: 'Sign in'});
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

    await page.getByRole('link', { name: 'Sakimafia122' }).waitFor();
    });

    test('@smoke Profile is visible', async ({page}) => {
        await expect(page.getByRole('link', {name: username})).toBeVisible();
    })

    test('@smoke @regression My feed', async ({page}) => {
        await page.getByText(' Your Feed ').click()

        await expect(page.getByText('No articles are here... yet.')).toBeVisible();
    })

    test('@smoke Logout and login with wrong password', async ({page}) => {
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

    test('@regression Articles are filtered by tags', async ({page}) => {
        const tagName = 'YouTube';

        const youtubeTag = await page.locator('.tag-list a.tag-default', { hasText: tagName })
        await page.waitForTimeout(1000);
        await expect(youtubeTag).toBeVisible();
        await youtubeTag.click({force: true})

        await page.waitForTimeout(1000);
        await expect(page.locator('a.nav-link.active', { hasText: 'YouTube' })).toBeVisible();

        const articles = page.locator('.article-preview');
        await expect(articles.first()).toBeVisible();

        const count = await articles.count();
        expect(count).toBeGreaterThan(0);

        for(let i = 0; i < count; i++){
            const article = articles.nth(i);
            const youtubeTag = article.locator('ul.tag-list li', { hasText: /YouTube/i });

            await expect(youtubeTag).toHaveCount(1);
        }
    })

    test('@smoke External links in another tab', async ({page}) => {

        //Logout
        //await page.getByRole('link', {name: username}).click();
        //await expect(page.locator('a', {hasText: ' Edit Profile Settings '})).toBeVisible();
        //await page.locator('a', {hasText: ' Edit Profile Settings '}).click();
        //await expect(page).toHaveURL('https://conduit.bondaracademy.com/settings');
        //await page.getByRole('button', {name: ' Or click here to logout. '}).click();
        //await expect(page.locator('a', {hasText: ' Sign in '})).toBeVisible();

        //Metoda logout
        const userLogout = new LogoutPage(page);
        await userLogout.logout(username);

        await page.getByRole('link', {name: 'www.bondaracademy.com'}).click();

        const [newPage] = await Promise.all([
  page.context().waitForEvent('page'), // čeka novi tab
]);

await expect(newPage).toHaveURL(/bondaracademy/);

await page.waitForTimeout(2000); // Da potvrdim vizuelno da je tab otvoren
await newPage.close();
    });

    
    test("@smoke Add a new article", async ({page}) => {
        await page.locator("a", {hasText: " New Article "}).click();
        await expect(page).toHaveURL('https://conduit.bondaracademy.com/editor');

        //const title = 'Novak Djokovic je sampion'
        const articalTitle = await page.getByPlaceholder('Article Title');
        await articalTitle.fill(title);

        //const description = 'Sampion tenisa i direktor univerzuma';
        const descriptionTitle = await page.getByPlaceholder("What's this article about?");
        await descriptionTitle.fill(description);

        //const content = "Новак Ђоковић српски је тенисер. На првом месту АТП листе је провео 428 недеља што је најдужи период у историји отворене ере.";
        const contentField = await page.getByPlaceholder("Write your article (in markdown)");
        await contentField.fill(content);

        //const tags = 'Tennis';
        const tagField = await page.getByPlaceholder("Enter tags");
        await tagField.fill(tags);

        await page.getByRole('button', {name: ' Publish Article '}).click();

        await expect(page.locator('h1', {hasText: title})).toBeVisible();

        // Provera na Home page
        await page.locator('a', {hasText: ' Home '}).click();
        await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
        await expect(page.locator('h1', {hasText: title})).toBeVisible();
        await expect(page.locator('li', {hasText: tags})).toBeVisible();

        // Provera na profile page
        await page.locator(`a[href="/profile/${username}"]`).first().click();
        await expect(page).toHaveURL(`https://conduit.bondaracademy.com/profile/${username}`);
        await expect(page.locator('h1', {hasText: title})).toBeVisible();
        await expect(page.locator('li', {hasText: tags})).toBeVisible();

    })

    test('@smoke The same article cannot be added again', async ({page}) => {

        await page.locator("a", {hasText: " New Article "}).click();
        await expect(page).toHaveURL('https://conduit.bondaracademy.com/editor');

        const articalTitle = await page.getByPlaceholder('Article Title');
        await articalTitle.fill(title);

        const descriptionTitle = await page.getByPlaceholder("What's this article about?");
        await descriptionTitle.fill(description);

        const contentField = await page.getByPlaceholder("Write your article (in markdown)");
        await contentField.fill(content);

        const tagField = await page.getByPlaceholder("Enter tags");
        await tagField.fill(tags);

        await page.getByRole('button', {name: ' Publish Article '}).click();

        await expect(page.locator('li', {hasText: 'title must be unique'})).toBeVisible();
        await expect(page.locator('.error-messages')).toHaveCSS('color', 'rgb(184, 92, 92)');
    })

});

//npx playwright test tests/E2E.spec.ts --project=chromium --reporter=html