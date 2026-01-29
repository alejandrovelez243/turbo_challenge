"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/auth";
import styles from "./login.module.css";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (err: Error & { response?: { data?: { non_field_errors?: string[] } } }) => {
            setError(err.response?.data?.non_field_errors?.[0] || "Invalid credentials. Please try again.");
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
            setError("Please enter your password.");
            return;
        }

        loginMutation.mutate({ email, password });
    };


    return (
        <main className={styles.container}>
            {/* Design Image: Cactus for Login */}
            <div className={styles.logoWrapper}>
                <Image
                    src="/pets/cactus.png"
                    alt="Welcome"
                    width={96}
                    height={114}
                    priority
                />
            </div>

            <h1 className={styles.title}>Yay, You&apos;re Back!</h1>

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
                            data-testid="password-toggle"
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
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                </button>

                <Link href="/register" className={styles.footerText}>
                    Oops! I&apos;ve never been here before
                </Link>
            </form>
        </main>
    );
}
