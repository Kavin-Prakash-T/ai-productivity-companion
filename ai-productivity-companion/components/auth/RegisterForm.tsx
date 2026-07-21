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
                        size={20}
                        className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 focus:border-black"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <Mail
                        size={20}
                        className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 focus:border-black"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <Lock
                        size={20}
                        className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-12 focus:border-black"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-3"
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Lock
                        size={20}
                        className="absolute left-4 top-3.5 text-gray-500"
                    />

                    <input
                        type={
                            showConfirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-12 focus:border-black"
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
                        className="absolute right-4 top-3"
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
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

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-black hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </AuthCard>
    );
}