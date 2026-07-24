"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthCard from "../common/AuthCard";
import Button from "../common/Button";
import {
  verifyEmail,
  registerUser,
} from "@/services/authService";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify() {
    if (!otp) {
      return toast.error("Enter OTP");
    }

    try {
      setLoading(true);

      const { data } = await verifyEmail({
        email,
        otp,
      });

      toast.success(data.message);

      router.push("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      setResending(true);

      await registerUser({
        email,
      });

      toast.success("OTP sent again.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP"
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the OTP sent to your email."
    >
      <div className="space-y-5">

        <div className="flex justify-center">
          <div className="rounded-full bg-gray-100 border border-[#E5E7EB] p-4 text-[#0A0A0A]">
            <ShieldCheck size={28} />
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-gray-50 p-3.5 flex items-center gap-3 text-[#0A0A0A]">
          <Mail size={16} className="text-[#9CA3AF]" />

          <span className="text-sm break-all font-medium">
            {email}
          </span>
        </div>

        <input
          type="text"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-center text-xl tracking-[10px] text-[#0A0A0A] placeholder-[#D1D5DB] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
        />

        <Button
          title={
            loading
              ? "Verifying..."
              : "Verify Email"
          }
          onClick={handleVerify}
          disabled={loading}
        />

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full rounded-xl border border-[#E5E7EB] bg-white text-[#0A0A0A] hover:bg-gray-50 h-12 transition-all duration-200 font-medium shadow-sm"
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

        <p className="text-center text-sm text-[#6B7280]">
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#0A0A0A] hover:underline transition-colors"
          >
            Register Again
          </Link>
        </p>

      </div>
    </AuthCard>
  );
}