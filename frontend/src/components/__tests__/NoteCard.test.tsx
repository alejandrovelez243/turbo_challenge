import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoteCard } from '../NoteCard';

const mockNote = {
    title: 'Test Note Title',
    content: 'This is the body content of the test note that we are testing.',
    category: 'Work',
    colorHex: '#ef9c66',
    date: '2026-01-28T10:00:00Z',
};

describe('NoteCard', () => {
    it('renders the note title', () => {
        render(
            <NoteCard
                title={mockNote.title}
                content={mockNote.content}
                category={mockNote.category}
                colorHex={mockNote.colorHex}
                date={mockNote.date}
            />
        );

        expect(screen.getByText('Test Note Title')).toBeInTheDocument();
    });

    it('renders the note content', () => {
        render(
            <NoteCard
                title={mockNote.title}
                content={mockNote.content}
                category={mockNote.category}
                colorHex={mockNote.colorHex}
                date={mockNote.date}
            />
        );

        expect(screen.getByText(/This is the body content/)).toBeInTheDocument();
    });

    it('renders the category name', () => {
        render(
            <NoteCard
                title={mockNote.title}
                content={mockNote.content}
                category={mockNote.category}
                colorHex={mockNote.colorHex}
                date={mockNote.date}
            />
        );

        expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('applies category color to the card', () => {
        const { container } = render(
            <NoteCard
                title={mockNote.title}
                content={mockNote.content}
                category={mockNote.category}
                colorHex={mockNote.colorHex}
                date={mockNote.date}
            />
        );

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveStyle({ borderColor: '#ef9c66' });
    });

    it('displays "today" for today\'s date', () => {
        const todayDate = new Date().toISOString();
        render(
            <NoteCard
                title={mockNote.title}
                content={mockNote.content}
                category={mockNote.category}
                colorHex={mockNote.colorHex}
                date={todayDate}
            />
        );

        expect(screen.getByText(/today/i)).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(
            <NoteCard
                title={mockNote.title}
                content={mockNote.content}
                category={mockNote.category}
                colorHex={mockNote.colorHex}
                date={mockNote.date}
                onClick={handleClick}
            />
        );

        const card = screen.getByText('Test Note Title').closest('div');
        card?.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
