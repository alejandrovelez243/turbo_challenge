import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    isLoading,
    className = "",
    disabled,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? "..." : children}
        </button>
    );
};
