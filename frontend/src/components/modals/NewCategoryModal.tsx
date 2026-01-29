"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/services/api/categories";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

interface NewCategoryModalProps {
  onClose: () => void;
}

const COLORS = [
  { name: "Orange", value: "#ef9c6680" },
  { name: "Yellow", value: "#fcdc9480" },
  { name: "Blue", value: "#78aba880" },
  { name: "Green", value: "#c8cfa080" },
  { name: "Mint", value: "#a8d5ba80" },
  { name: "Pink", value: "#f4c2c280" },
];

export const NewCategoryModal = ({ onClose }: NewCategoryModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0].value);

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strip alpha channel - backend expects 7 chars (#RRGGBB)
    const colorWithoutAlpha = color.substring(0, 7);
    mutation.mutate({ name, color: colorWithoutAlpha });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>New Category</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name..."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Color</label>
            <div className={styles.colorPicker}>
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`${styles.colorDot} ${color === c.value ? styles.active : ""}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};
