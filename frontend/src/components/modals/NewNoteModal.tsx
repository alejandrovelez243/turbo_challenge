"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote } from "@/services/api/notes";
import { Category, Note } from "@/types";
import { X, ChevronDown, Save } from "lucide-react";
import styles from "./NoteModal.module.css";

interface NoteModalProps {
  categories: Category[];
  selectedCategory?: string;
  note?: Note; // If provided, we're in edit mode
  onClose: () => void;
}

export const NoteModal = ({ categories, selectedCategory, note, onClose }: NoteModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!note;

  // Initialize state with note data if editing
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const [error, setError] = useState("");

  // Pre-select category
  const getInitialCategoryId = () => {
    if (note) return note.category.id;
    if (selectedCategory && selectedCategory !== "All Categories") {
      return categories.find(cat => cat.name === selectedCategory)?.id || categories[0]?.id;
    }
    return categories[0]?.id;
  };

  const [categoryId, setCategoryId] = useState<number>(getInitialCategoryId() || 0);

  // Get current category for styling
  const currentCategory = categories.find(cat => cat.id === categoryId);
  const categoryColor = currentCategory?.color || "#ef9c66";
  const cardBgColor = categoryColor.length === 7 ? `${categoryColor}80` : categoryColor;
  const cardBorderColor = categoryColor.length === 7 ? categoryColor : categoryColor.replace("80", "ff");

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err: Error & { response?: { data?: { detail?: string } } }) => {
      setError(err.response?.data?.detail || "Failed to save note. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title: string; body: string; category_id: number } }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err: Error & { response?: { data?: { detail?: string } } }) => {
      setError(err.response?.data?.detail || "Failed to save note. Please try again.");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Custom validation
    if (!title.trim()) {
      setError("Please enter a title for your note.");
      return;
    }
    if (!body.trim()) {
      setError("Please write something in your note.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    const noteData = { title: title.trim(), body: body.trim(), category_id: categoryId };

    if (isEditMode && note) {
      updateMutation.mutate({ id: note.id, data: noteData });
    } else {
      createMutation.mutate(noteData);
    }
  };

  // Format date for display
  const formatEditDate = () => {
    const date = note ? new Date(note.updated_at) : new Date();
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header with dropdown and close button */}
        <div className={styles.modalHeader}>
          <div className={styles.categoryDropdownWrapper}>
            <div
              className={styles.categoryDot}
              style={{ backgroundColor: cardBorderColor }}
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className={styles.categoryDropdown}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className={styles.dropdownIcon} />
          </div>

          <button onClick={onClose} className={styles.closeBtn} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Inner Card with Note Content */}
        <form
          onSubmit={handleSubmit}
          className={styles.noteCard}
          style={{
            backgroundColor: cardBgColor,
            borderColor: cardBorderColor,
          }}
          noValidate
        >
          {/* Last Edited Info */}
          <div className={styles.lastEdited}>
            Last Edited: {formatEditDate()}
          </div>

          {/* Error Message */}
          {error && <p className={styles.errorText}>{error}</p>}

          {/* Note Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className={styles.titleInput}
          />

          {/* Note Content */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Pour your heart out..."
            className={styles.bodyTextarea}
          />

          {/* Save Button */}
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={isPending}
          >
            <Save size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// Export for backwards compatibility
export const NewNoteModal = NoteModal;
