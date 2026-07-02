import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return errorResponse("Email and OTP are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    if (user.isVerified) {
      return errorResponse("Email already verified", 400);
    }

    if (user.emailOtp !== otp) {
      return errorResponse("Invalid OTP", 400);
    }

    if (!user.emailOtpExpires || user.emailOtpExpires < new Date()) {
      return errorResponse("OTP expired", 400);
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    return successResponse("Email verified successfully");
  } catch (error) {
    console.error("Verify email error:", error);
    return errorResponse("Internal server error", 500);
  }
}