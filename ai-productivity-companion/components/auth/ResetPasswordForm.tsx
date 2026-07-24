"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import AuthCard from "../common/AuthCard";
import Button from "../common/Button";
import { resetPassword } from "@/services/authService";

export default function ResetPasswordForm() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    async function handleResetPassword() {
        if (!otp || !password || !confirmPassword) {
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

            const { data } = await resetPassword({
                email,
                otp,
                password,
            });

            toast.success(data.message);

            router.push("/login");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            title="Reset Password"
            subtitle="Enter the OTP and create a new password."
        >
            <div className="space-y-5">

                <div className="relative">

                    <ShieldCheck
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />

                    <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-4 text-center tracking-[8px] text-[#0A0A0A] placeholder-[#D1D5DB] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                    />

                </div>

                <div className="relative">

                    <Lock
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-12 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
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

                <div className="relative">

                    <Lock
                        size={18}
                        className="absolute left-4 top-3.5 text-[#9CA3AF]"
                    />

                    <input
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-12 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
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
                        loading
                            ? "Updating..."
                            : "Reset Password"
                    }
                    onClick={handleResetPassword}
                    disabled={loading}
                />

            </div>
        </AuthCard>
    );
}