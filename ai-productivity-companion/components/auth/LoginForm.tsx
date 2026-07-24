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
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-4 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />
                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Password"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-12 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        type="button"
                        className="absolute right-4 top-3.5 text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                <div className="text-right">
                    <Link
                        href="/forget-passoword"
                        className="text-xs text-[#0A0A0A] font-medium hover:underline transition-colors"
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
                    disabled={loading}
                />

                <p className="text-center text-sm text-[#6B7280]">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-[#0A0A0A] hover:underline transition-colors"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </AuthCard>
    );
}