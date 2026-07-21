"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import AuthCard from "../common/AuthCard";
import Button from "../common/Button";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
    const router = useRouter();

    const { login } = useAuth();

    const [showPassword, setShowPassword] =
        useState(false);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleLogin() {
        if (!email || !password) {
            return toast.error("Fill all fields");
        }

        try {
            setLoading(true);

            const { data } = await loginUser({
                email,
                password,
            });

            login(data.token, data.user);

            toast.success(data.message);

            router.push("/dashboard");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            title="Welcome Back"
            subtitle="Login to continue"
        >
            <div className="space-y-5">
                <div className="relative">
                    <Mail
                        className="absolute left-4 top-3.5"
                        size={20}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="h-12 w-full rounded-xl border pl-12 pr-4"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <div className="relative">
                    <Lock
                        className="absolute left-4 top-3.5"
                        size={20}
                    />

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Password"
                        className="h-12 w-full rounded-xl border pl-12 pr-12"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        type="button"
                        className="absolute right-4 top-3"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>

                <div className="text-right">
                    <Link
                        href="/forgot-password"
                        className="text-sm hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    title={
                        loading
                            ? "Signing In..."
                            : "Login"
                    }
                    onClick={handleLogin}
                />

                <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </AuthCard>
    );
}