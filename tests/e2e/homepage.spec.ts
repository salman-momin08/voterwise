import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VoterWise/);
  });

  test('should render the navigation bar', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
