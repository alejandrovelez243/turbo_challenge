import { test, expect } from './fixtures';

test.describe('Visual Regression Tests', () => {
    test('login page visual snapshot', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('login-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
        });
    });

    test('register page visual snapshot', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('register-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
        });
    });

    test('dashboard page visual snapshot', async ({ page }) => {
        // Set auth cookie before navigating
        await page.context().addCookies([
            { name: 'token', value: 'mock-token-12345', domain: 'localhost', path: '/' }
        ]);

        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('dashboard-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
        });
    });
});
