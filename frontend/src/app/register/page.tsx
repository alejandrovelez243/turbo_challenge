"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/api/auth";
import styles from "../login/register.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            router.push("/login");
        },
        onError: (err: Error & { response?: { data?: Record<string, string[]> } }) => {
            const data = err.response?.data;
            const firstError = data ? Object.values(data)[0] : "Registration failed.";
            setError(Array.isArray(firstError) ? firstError[0] : firstError);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Custom validation
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Please enter a password.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        signupMutation.mutate({ email, password });
    };

    return (
        <main className={styles.container}>
            {/* Design Image: Cat for Register */}
            <div className={styles.logoWrapper}>
                <Image
                    src="/pets/cat.png"
                    alt="New Friend"
                    width={180}
                    height={128}
                    priority
                />
            </div>

            <h1 className={styles.title}>Yay, New Friend!</h1>

            {error && <p className={styles.errorText}>{error}</p>}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            placeholder="Email address"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.eyeButton}
                        >
                            {showPassword ? (
                                <Eye size={20} color="#957139" />
                            ) : (
                                <EyeClosed size={20} color="#957139" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={signupMutation.isPending}
                >
                    {signupMutation.isPending ? "Signing up..." : "Sign Up"}
                </button>

                <Link href="/login" className={styles.footerText}>
                    We&apos;re already friends!
                </Link>
            </form>
        </main>
    );
}
