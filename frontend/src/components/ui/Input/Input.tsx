import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
    error,
    isPassword,
    className = "",
    type,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
                <input
                    type={inputType}
                    className={`${styles.input} ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeButton}
                        tabIndex={-1}
                        data-testid="password-toggle"
                    >
                        {showPassword ? (
                            <Eye size={20} color="#957139" />
                        ) : (
                            <EyeClosed size={20} color="#957139" />
                        )}
                    </button>
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};
