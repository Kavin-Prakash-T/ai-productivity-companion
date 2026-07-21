"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthCard from "../common/AuthCard";
import Button from "../common/Button";
import { forgotPassword } from "@/services/authService";

export default function ForgotPasswordForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleForgotPassword() {
        if (!email) {
            return toast.error("Enter your email.");
        }

        try {
            setLoading(true);

            const { data } = await forgotPassword({
                email,
            });

            toast.success(data.message);

            router.push(
                `/reset-password?email=${encodeURIComponent(email)}`
            );
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard
            title="Forgot Password"
            subtitle="We'll send an OTP to your email."
        >
            <div className="space-y-5">

                <div className="relative">

                    <Mail
                        className="absolute left-4 top-3.5 text-gray-500"
                        size={20}
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full h-12 rounded-xl border border-gray-300 pl-12 pr-4 focus:border-black"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </div>

                <Button
                    title={
                        loading
                            ? "Sending OTP..."
                            : "Send OTP"
                    }
                    onClick={handleForgotPassword}
                    disabled={loading}
                />

            </div>
        </AuthCard>
    );
}