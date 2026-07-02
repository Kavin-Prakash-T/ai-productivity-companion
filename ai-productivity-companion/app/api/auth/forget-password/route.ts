import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateOtp } from "@/utils/generateOtp";
import { sendEmail } from "@/utils/sendEmail";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;

    await user.save();

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Your reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    return successResponse("Password reset OTP sent to email");
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse("Internal server error", 500);
  }
}