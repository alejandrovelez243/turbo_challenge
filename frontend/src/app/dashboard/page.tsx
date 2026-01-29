"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { getNotes, deleteNote, NotesFilter } from "@/services/api/notes";
import { logout } from "@/services/api/auth";
import { NoteCard } from "@/components/NoteCard/NoteCard";
import { NoteModal } from "@/components/modals/NewNoteModal";
import { NewCategoryModal } from "@/components/modals/NewCategoryModal";
import { Plus, Search, LogOut } from "lucide-react";
import { Note } from "@/types";
import styles from "./dashboard.module.css";

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useMemo(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function DashboardPage() {
    const queryClient = useQueryClient();

    // Filter state
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    // Debounce search query to avoid excessive API calls
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Build filters for API call
    const filters: NotesFilter = useMemo(() => ({
        category: selectedCategory,
        search: debouncedSearch || undefined,
    }), [selectedCategory, debouncedSearch]);

    // Queries
    const { data: categories, isLoading: loadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: notes, isLoading: loadingNotes } = useQuery({
        queryKey: ["notes", filters],
        queryFn: () => getNotes(filters),
    });

    // Mutations
    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    // Handlers
    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    const handleNoteClick = (note: Note) => {
        setEditingNote(note);
    };

    const handleNoteDelete = (noteId: number) => {
        deleteNoteMutation.mutate(noteId);
    };

    const handleCloseModal = () => {
        setIsNoteModalOpen(false);
        setEditingNote(null);
    };

    // Compute if notes are empty
    const hasNoNotes = !notes || notes.length === 0;
    const isModalOpen = isNoteModalOpen || editingNote !== null;

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Categories</h2>

                <nav className={styles.categories}>
                    <button
                        onClick={() => handleCategorySelect("All Categories")}
                        className={`${styles.categoryItem} ${selectedCategory === "All Categories" ? styles.active : ""}`}
                    >
                        <span>All Categories</span>
                    </button>

                    {loadingCategories ? (
                        <p className={styles.loading}>Loading...</p>
                    ) : (
                        categories?.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.name)}
                                className={`${styles.categoryItem} ${selectedCategory === cat.name ? styles.active : ""}`}
                            >
                                <div className={styles.categoryLabel}>
                                    <span
                                        className={styles.categoryDot}
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span>{cat.name}</span>
                                </div>
                                <span className={styles.count}>{cat.note_count}</span>
                            </button>
                        ))
                    )}

                    {/* New Category button - inside the nav, after categories */}
                    <button
                        className={styles.newCategoryBtn}
                        onClick={() => setIsCategoryModalOpen(true)}
                    >
                        <Plus size={14} />
                        New Category
                    </button>
                </nav>

                {/* Logout at bottom */}
                <button
                    className={styles.logoutBtn}
                    onClick={() => {
                        logout();
                        window.location.href = "/login";
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        className={styles.newNoteBtn}
                        onClick={() => setIsNoteModalOpen(true)}
                    >
                        <Plus size={20} />
                        New Note
                    </button>
                </header>

                {loadingNotes ? (
                    <div className={styles.loadingContainer}>
                        <p>Fetching your thoughts...</p>
                    </div>
                ) : (
                    <div className={hasNoNotes ? styles.emptyContainer : styles.notesGrid}>
                        {hasNoNotes ? (
                            <div className={styles.emptyState}>
                                <Image
                                    src="/pets/bubble_tea.png"
                                    alt="No notes yet"
                                    width={294}
                                    height={294}
                                    className={styles.emptyImage}
                                />
                                <p className={styles.emptyText}>
                                    I&apos;m just here waiting for your charming notes...
                                </p>
                            </div>
                        ) : (
                            notes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    title={note.title}
                                    content={note.body}
                                    date={note.updated_at}
                                    category={note.category.name}
                                    colorHex={note.category.color}
                                    onClick={() => handleNoteClick(note)}
                                    onDelete={() => handleNoteDelete(note.id)}
                                />
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Modals */}
            {isModalOpen && categories && (
                <NoteModal
                    categories={categories}
                    selectedCategory={selectedCategory}
                    note={editingNote || undefined}
                    onClose={handleCloseModal}
                />
            )}

            {isCategoryModalOpen && (
                <NewCategoryModal onClose={() => setIsCategoryModalOpen(false)} />
            )}
        </div>
    );
}
