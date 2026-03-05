import { test, expect } from '@playwright/test';

test.describe('VimiAI Smoke Tests', () => {
    test('should load the landing page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/VimiAI/);
    });

    test('should redirect to login when accessing workspace without auth', async ({ page }) => {
        await page.goto('/workspace');
        await expect(page).toHaveURL(/\/login/);
    });

    test('should show login form', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toContainText(/Welcome/i);
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });
});
