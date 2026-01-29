import { test, expect } from './fixtures';

test.describe('Root Redirect', () => {
    test('should redirect unauthenticated user from / to /login', async ({ page }) => {
        // Ensure no token
        await page.context().clearCookies();

        await page.goto('/');
        await expect(page).toHaveURL(/.*login/);
    });

    test('should redirect authenticated user from / to /dashboard', async ({ page }) => {
        // Set a mock token
        await page.context().addCookies([{
            name: 'token',
            value: 'mock-token',
            domain: 'localhost',
            path: '/',
        }]);

        await page.goto('/');
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should redirect authenticated user away from /login to /dashboard', async ({ page }) => {
        // Set a mock token
        await page.context().addCookies([{
            name: 'token',
            value: 'mock-token',
            domain: 'localhost',
            path: '/',
        }]);

        await page.goto('/login');
        await expect(page).toHaveURL(/.*dashboard/);
    });
});
