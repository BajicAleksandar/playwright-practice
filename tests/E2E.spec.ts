import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { LogoutPage } from '../Pages/LogoutPage';

test.describe('Logged in user tests', () => {

    let userEmail = 'Sakismafia122@mail.com';
    let userPassword = 'Password123!';
    let username = 'Sakimafia122';

    //Articles
    const comment = 'Ovo je moj prvi komentar';
    const title = 'Novak Djokovic je sampion';
    const title2 = 'Novak Djokovic je sampion svemira i novi predsednik Srbije';
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

    test('@smoke Add a comment', async ({page}) => {

        await page.locator(`a[href="/profile/${username}"]`).first().click();
        await page.locator('h1', {hasText: title}).click();

        await page.getByPlaceholder('Write a comment...').click();
        await page.getByPlaceholder('Write a comment...').fill(comment);

        await page.getByRole('button', {name: ' Post Comment '}).click();
        await expect(page.locator('p', {hasText: comment})).toBeVisible();
    });

    test('@smoke Delete the comment', async ({page}) => {

        await page.locator(`a[href="/profile/${username}"]`).first().click();
        await page.locator('h1', {hasText: title}).click();

        const commentField = page.locator('app-article-comment', {hasText: comment});

        await commentField.locator('.ion-trash-a').click();
        await expect(page.locator('.card-text', {hasText: comment})).not.toBeVisible();
    })

    test('@smoke Edit Article', async ({page}) => {

        await page.locator(`a[href="/profile/${username}"]`).first().click();
        await page.locator('h1', {hasText: title}).click();
        await page.locator('a', {hasText: ' Edit Article '}).first().click();

        await page.locator('[formcontrolname="title"]').fill(title2);
        await page.getByRole('button', {name: ' Publish Article '}).click();

        await expect(page.locator('h1', {hasText: title2})).toBeVisible();
    
    });

    test('@regression Navigation bar is visible', async ({page}) => {
        //The issue was identified during testing of this test page. 
        //This scenario demonstrates that the issue is present under specific conditions.

        await page.locator(`a[href="/profile/${username}"]`).first().click();

        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
        await expect(page.getByRole('link', { name: username })).toBeVisible();
        
        await page.locator('h1', {hasText: title}).click();
        await page.locator('a', {hasText: ' Edit Article '}).first().click();
        await page.waitForTimeout(4000);
        await page.goBack();

        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
        await expect(page.getByRole('link', { name: username })).toBeVisible();
    });

    test('@regression The post is visible in Your Feed', async ({page}) => {
        //The issue was identified during testing of this test page.

        await expect(page.locator('h1', {hasText: title})).toBeVisible();

        await page.locator('a', {hasText: ' Your Feed '}).click();
        await expect(page.locator('h1', {hasText: title})).toBeVisible();

    });

    test('@regression Change the page', async ({page}) => {

        await page.locator('.page-link', { hasText: '2' }).click();
        await expect(page.locator('app-article-list')).not.toHaveCount(0);
        await expect(page.locator('.tag-list')).toBeVisible();
    });

    test('@regression Each tag shows at least one article', async ({page}) => {
        test.setTimeout(80000);
        await page.waitForTimeout(2000)

        // Uzimamo samo tagove iz sidebara (Popular Tags)
    const tags2 = page.locator('.sidebar .tag-pill');
    const tagCount = await tags2.count();

    for (let i = 0; i < tagCount; i++) {

        // Ponovo dohvatamo tag u svakoj iteraciji
        const tag = page.locator('.sidebar .tag-pill').nth(i);
        const tagName = (await tag.innerText()).trim();

        await tag.click();
        await page.waitForTimeout(2500)

        const activeTag = page.locator('.feed-toggle');

        await expect(activeTag.locator('i.ion-pound')).toBeVisible();

        await expect(activeTag).toContainText(tagName);

        // Proveri da se bar jedan article pojavio

        const articles = page.locator('app-article-preview');
        await expect(articles.first()).toBeVisible();

        const articleCount = await articles.count();
        expect(articleCount).toBeGreaterThan(0);

        };
    });


});

//npx playwright test tests/E2E.spec.ts --project=chromium --reporter=html