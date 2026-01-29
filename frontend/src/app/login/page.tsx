"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/auth";
import { AuthLayout } from "@/components/auth/AuthLayout/AuthLayout";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { AxiosError } from "axios";
import styles from "./auth-page.module.css";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (err: AxiosError<{ non_field_errors?: string[] }>) => {
            setError(err.response?.data?.non_field_errors?.[0] || "Invalid credentials. Please try again.");
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
            setError("Please enter your password.");
            return;
        }

        loginMutation.mutate({ email, password });
    };

    return (
        <AuthLayout
            title="Yay, You're Back!"
            imageSrc="/pets/cactus.png"
            imageAlt="Welcome"
            imageWidth={96}
            imageHeight={114}
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

                <Button type="submit" isLoading={loginMutation.isPending}>
                    Login
                </Button>

                <Link href="/register" className={styles.footerText}>
                    Oops! I&apos;ve never been here before
                </Link>
            </form>
        </AuthLayout>
    );
}
