import { Trash2 } from "lucide-react";
import styles from "./NoteCard.module.css";

interface NoteCardProps {
    title: string;
    content: string;
    date: string;
    category?: string;
    colorHex?: string;
    onClick?: () => void;
    onDelete?: () => void;
}

const formatDate = (dateString: string): string => {
    const noteDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset hours for comparison
    const resetTime = (d: Date) => {
        const copy = new Date(d);
        copy.setHours(0, 0, 0, 0);
        return copy;
    };

    const noteDateOnly = resetTime(noteDate);
    const todayOnly = resetTime(today);
    const yesterdayOnly = resetTime(yesterday);

    if (noteDateOnly.getTime() === todayOnly.getTime()) {
        return "today";
    } else if (noteDateOnly.getTime() === yesterdayOnly.getTime()) {
        return "yesterday";
    } else {
        // Format as "Month Day"
        return noteDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric"
        });
    }
};

export const NoteCard = ({
    title,
    content,
    date,
    category,
    colorHex,
    onClick,
    onDelete,
}: NoteCardProps) => {
    const displayDate = formatDate(date);

    // Use the color from API directly with alpha for background
    const getCardStyles = (hex?: string) => {
        if (!hex) return {};
        // Ensure we have a proper hex without alpha
        const cleanHex = hex.length === 7 ? hex : hex.substring(0, 7);
        return {
            backgroundColor: `${cleanHex}80`, // 50% opacity
            borderColor: cleanHex,
        };
    };

    const cardStyles = getCardStyles(colorHex);

    return (
        <div
            className={styles.card}
            style={cardStyles}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className={styles.header}>
                <span className={styles.date}>
                    <strong>{displayDate}</strong> {category && category}
                </span>
                {onDelete && (
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.content}>{content}</p>
        </div>
    );
};
