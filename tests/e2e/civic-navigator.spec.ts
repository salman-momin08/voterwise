import { test, expect } from '@playwright/test';

test.describe('Civic Navigator', () => {
  test('should open the Civic Navigator from the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Click the main CTA button
    const getStartedBtn = page.getByText(/Find My Polling Booth/i).first();
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
      
      // Wait for the view header to change
      const header = page.locator('.view-header h1');
      await expect(header).toHaveText(/Civic Navigator/i);
    }
  });
});
