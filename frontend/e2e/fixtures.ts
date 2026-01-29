/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from '@playwright/test';

// Mock data
const mockCategories = [
    { id: 1, name: 'Work', color: '#ef9c66', note_count: 2 },
    { id: 2, name: 'Personal', color: '#78aba8', note_count: 1 },
];

const mockNotes = [
    {
        id: 1,
        title: 'Meeting Notes',
        body: 'Discuss project timeline',
        category: { id: 1, name: 'Work', color: '#ef9c66' },
        created_at: '2026-01-28T10:00:00Z',
        updated_at: '2026-01-28T10:00:00Z',
    },
    {
        id: 2,
        title: 'Shopping List',
        body: 'Milk, bread, eggs',
        category: { id: 2, name: 'Personal', color: '#78aba8' },
        created_at: '2026-01-27T15:00:00Z',
        updated_at: '2026-01-27T15:00:00Z',
    },
];

// Extend test with API mocking
export const test = base.extend({
    // Auto-mock all API routes before each test
    page: async ({ page }, use) => {
        // Mock auth endpoints
        await page.route('**/api/auth/login/', async (route) => {
            const body = route.request().postDataJSON();
            if (body?.email === 'test@example.com' && body?.password === 'password123') {
                await route.fulfill({ json: { token: 'mock-token-12345' } });
            } else {
                await route.fulfill({ status: 400, json: { non_field_errors: ['Invalid credentials'] } });
            }
        });

        await page.route('**/api/auth/signup/', async (route) => {
            const body = route.request().postDataJSON();
            await route.fulfill({ status: 201, json: { email: body?.email } });
        });

        await page.route('**/api/auth/logout/', async (route) => {
            await route.fulfill({ json: {} });
        });

        // Mock categories
        await page.route('**/api/categories/', async (route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({ json: mockCategories });
            } else if (route.request().method() === 'POST') {
                const body = route.request().postDataJSON();
                await route.fulfill({
                    status: 201,
                    json: { id: 3, name: body?.name, color: body?.color, note_count: 0 },
                });
            }
        });

        // Mock notes
        await page.route('**/api/notes/**', async (route) => {
            const method = route.request().method();
            if (method === 'GET') {
                await route.fulfill({ json: mockNotes });
            } else if (method === 'POST') {
                const body = route.request().postDataJSON();
                await route.fulfill({
                    status: 201,
                    json: {
                        id: 3,
                        title: body?.title,
                        body: body?.body,
                        category: mockCategories[0],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                });
            } else if (method === 'PATCH' || method === 'DELETE') {
                await route.fulfill({ status: 204 });
            }
        });

        await page.route('**/api/notes/', async (route) => {
            await route.fulfill({ json: mockNotes });
        });

        await use(page);
    },
});

export { expect };
