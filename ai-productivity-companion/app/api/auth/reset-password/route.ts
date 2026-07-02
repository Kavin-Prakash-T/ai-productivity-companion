import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return errorResponse("Email, OTP and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    if (user.resetOtp !== otp) {
      return errorResponse("Invalid OTP", 400);
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return errorResponse("OTP expired", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    return successResponse("Password reset successful");
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse("Internal server error", 500);
  }
}