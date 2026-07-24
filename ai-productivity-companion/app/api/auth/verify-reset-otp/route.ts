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

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("Invalid email or OTP", 400); // generic to prevent enumeration
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return errorResponse("OTP expired", 400);
    }

    if (user.resetOtp !== otp) {
      return errorResponse("Invalid email or OTP", 400);
    }

    return successResponse("OTP verified successfully");
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return errorResponse("Internal server error", 500);
  }
}
