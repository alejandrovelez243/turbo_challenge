"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/api/auth";
import { AuthLayout } from "@/components/auth/AuthLayout/AuthLayout";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { AxiosError } from "axios";
import styles from "../login/auth-page.module.css"; // Reuse form and footer styles

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            router.push("/login");
        },
        onError: (err: AxiosError<Record<string, string[]>>) => {
            const data = err.response?.data;
            const firstError = data ? Object.values(data)[0] : "Registration failed.";
            setError(Array.isArray(firstError) ? firstError[0] : (firstError as string));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }
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
        <AuthLayout
            title="Yay, New Friend!"
            imageSrc="/pets/cat.png"
            imageAlt="New Friend"
            imageWidth={180}
            imageHeight={128}
            error={error}
        >
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    isPassword
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" isLoading={signupMutation.isPending}>
                    Sign Up
                </Button>

                <Link href="/login" className={styles.footerText}>
                    We&apos;re already friends!
                </Link>
            </form>
        </AuthLayout>
    );
}
