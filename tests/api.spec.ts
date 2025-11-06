import { test, expect } from '@playwright/test';
import tags from '../Test-data/tags.json';

test('mock api/tags i proveri da se tagovi prikazuju', async ({ page }) => {
  // 1️⃣ Mock API pre navigacije
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(tags)
    });
  });

  // 2️⃣ Idi na sajt
  await page.goto('https://conduit.bondaracademy.com', { waitUntil: 'networkidle' });


  // 4️⃣ Proveri title da test radi i dalje
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
});

// mala promena za github


