import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/auth";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return errorResponse("Email and OTP are required", 400);
    }

    // Do NOT select +password — we don't need it here
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    if (user.isVerified) {
      return errorResponse("Email already verified", 400);
    }

    // Check expiry BEFORE comparing OTP to avoid unnecessary info leak
    if (!user.emailOtpExpires || user.emailOtpExpires < new Date()) {
      return errorResponse("OTP expired", 400);
    }

    if (user.emailOtp !== otp) {
      return errorResponse("Invalid OTP", 400);
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return successResponse("Email verified successfully", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return errorResponse("Internal server error", 500);
  }
}