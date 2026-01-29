import React from "react";
import Image from "next/image";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    error?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    imageSrc,
    imageAlt,
    imageWidth,
    imageHeight,
    error,
}) => {
    return (
        <main className={styles.container}>
            <div className={styles.logoWrapper}>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={imageWidth}
                    height={imageHeight}
                    priority
                />
            </div>

            <h1 className={styles.title}>{title}</h1>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.formContent}>
                {children}
            </div>
        </main>
    );
};
