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
          <div className="rounded-full bg-black p-4 text-white">
            <ShieldCheck size={28} />
          </div>
        </div>

        <div className="rounded-xl border p-3 flex items-center gap-3">
          <Mail size={18} />

          <span className="text-sm break-all">
            {email}
          </span>
        </div>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="h-12 w-full rounded-xl border border-gray-300 px-4 text-center text-xl tracking-[10px] focus:border-black"
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
          className="w-full rounded-xl border border-black h-12 hover:bg-gray-100 transition"
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-semibold text-black hover:underline"
          >
            Register Again
          </Link>
        </p>

      </div>
    </AuthCard>
  );
}