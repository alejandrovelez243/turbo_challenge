import { test, expect } from './fixtures';

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should display login form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /yay, you're back/i })).toBeVisible();
        await expect(page.getByPlaceholder('Email address')).toBeVisible();
        await expect(page.getByPlaceholder('Password')).toBeVisible();
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('should show error for empty email', async ({ page }) => {
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page.getByText('Please enter your email address')).toBeVisible();
    });

    test('should show error for invalid email format', async ({ page }) => {
        await page.getByPlaceholder('Email address').fill('invalidemail');
        await page.getByPlaceholder('Password').fill('password123');
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    });

    test('should show error for empty password', async ({ page }) => {
        await page.getByPlaceholder('Email address').fill('test@example.com');
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page.getByText('Please enter your password')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
        const passwordInput = page.getByPlaceholder('Password');
        await passwordInput.fill('mypassword');

        // Initially password type
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click eye button to show
        await page.getByTestId('password-toggle').click();
        await expect(passwordInput).toHaveAttribute('type', 'text');
    });

    test('should navigate to register page', async ({ page }) => {
        await page.getByText(/never been here before/i).click();
        await expect(page).toHaveURL('/register');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await page.getByPlaceholder('Email address').fill('test@example.com');
        await page.getByPlaceholder('Password').fill('password123');
        await page.getByRole('button', { name: /login/i }).click();

        // Should redirect to dashboard (mocked API returns success)
        await expect(page).toHaveURL('/dashboard');
    });
});
