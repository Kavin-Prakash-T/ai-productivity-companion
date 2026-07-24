"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import AuthCard from "../common/AuthCard";
import Button from "../common/Button";
import { registerUser } from "@/services/authService";

export default function RegisterForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleRegister() {
        const { name, email, password, confirmPassword } =
            formData;

        if (!name || !email || !password || !confirmPassword) {
            return toast.error("All fields are required.");
        }

        if (password.length < 8) {
            return toast.error(
                "Password must be at least 8 characters."
            );
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {
            setLoading(true);

            const { data } = await registerUser({
                name,
                email,
                password,
            });

            toast.success(data.message);

            router.push(
                `/verify-email?email=${encodeURIComponent(email)}`
            );
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            title="Create Account"
            subtitle="Start managing your productivity with AI."
        >
            <div className="space-y-5">
                {/* Name */}
                <div className="relative">
                    <User
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-4 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <Mail
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-4 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-12 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-3.5 text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Lock
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />
                    <input
                        type={
                            showConfirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-12 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }
                        className="absolute right-4 top-3.5 text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors"
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                <Button
                    title={
                        loading ? "Creating Account..." : "Create Account"
                    }
                    onClick={handleRegister}
                    disabled={loading}
                />

                <p className="text-center text-sm text-[#6B7280]">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-[#0A0A0A] hover:underline transition-colors"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </AuthCard>
    );
}