import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8000/api';

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

export const handlers = [
    // Auth handlers
    http.post(`${API_URL}/auth/login/`, async ({ request }) => {
        const body = await request.json() as { email: string; password: string };
        if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json({ token: 'mock-token-12345' });
        }
        return HttpResponse.json(
            { non_field_errors: ['Invalid credentials'] },
            { status: 400 }
        );
    }),

    http.post(`${API_URL}/auth/signup/`, async ({ request }) => {
        const body = await request.json() as { email: string; password: string };
        return HttpResponse.json({ email: body.email }, { status: 201 });
    }),

    http.post(`${API_URL}/auth/logout/`, () => {
        return HttpResponse.json({}, { status: 200 });
    }),

    // Categories handlers
    http.get(`${API_URL}/categories/`, () => {
        return HttpResponse.json(mockCategories);
    }),

    http.post(`${API_URL}/categories/`, async ({ request }) => {
        const body = await request.json() as { name: string; color: string };
        const newCategory = {
            id: 3,
            name: body.name,
            color: body.color,
            note_count: 0,
        };
        return HttpResponse.json(newCategory, { status: 201 });
    }),

    // Notes handlers
    http.get(`${API_URL}/notes/`, ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const category = url.searchParams.get('category');

        let filteredNotes = [...mockNotes];

        if (search) {
            filteredNotes = filteredNotes.filter(
                (note) =>
                    note.title.toLowerCase().includes(search.toLowerCase()) ||
                    note.body.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category) {
            filteredNotes = filteredNotes.filter(
                (note) => note.category.name.toLowerCase() === category.toLowerCase()
            );
        }

        return HttpResponse.json(filteredNotes);
    }),

    http.post(`${API_URL}/notes/`, async ({ request }) => {
        const body = await request.json() as { title: string; body: string; category_id: number };
        const category = mockCategories.find((c) => c.id === body.category_id);
        const newNote = {
            id: 3,
            title: body.title,
            body: body.body,
            category: category || mockCategories[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        return HttpResponse.json(newNote, { status: 201 });
    }),

    http.patch(`${API_URL}/notes/:id/`, async ({ request, params }) => {
        const body = await request.json() as { title?: string; body?: string };
        const note = mockNotes.find((n) => n.id === Number(params.id));
        if (!note) {
            return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
        }
        return HttpResponse.json({ ...note, ...body, updated_at: new Date().toISOString() });
    }),

    http.delete(`${API_URL}/notes/:id/`, ({ params }) => {
        const note = mockNotes.find((n) => n.id === Number(params.id));
        if (!note) {
            return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),
];
