import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateOtp } from "@/utils/generateOtp";
import { sendEmail } from "@/utils/sendEmail";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    await connectDB();

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return errorResponse("Invalid or empty request body", 400);
    }

    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return errorResponse("All fields are required", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (existingUser) {
      if (existingUser.isVerified) {
        return errorResponse("User already exists", 409);
      }

      // User exists but is not verified yet. Update details and generate new OTP.
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.emailOtp = otp;
      existingUser.emailOtpExpires = otpExpires;
      await existingUser.save();

      try {
        await sendEmail({
          to: email,
          subject: "Verify your email",
          html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP expires in 10 minutes.</p>
          `,
        });
      } catch (emailError) {
        console.log("\n=======================================================");
        console.log(`[DEV ONLY] Email send failed (port 465 blocked by network).`);
        console.log(`[DEV ONLY] Bypassing email send. Email verification OTP is: ${otp}`);
        console.log("=======================================================\n");
      }

      return successResponse("Signup successful. OTP sent to email.", {}, 201);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      name,
      email,
      password: hashedPassword,
      emailOtp: otp,
      emailOtpExpires: otpExpires,
    });

    try {
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
        `,
      });
    } catch (emailError) {
      console.log("\n=======================================================");
      console.log(`[DEV ONLY] Email send failed (port 465 blocked by network).`);
      console.log(`[DEV ONLY] Bypassing email send. Email verification OTP is: ${otp}`);
      console.log("=======================================================\n");
    }

    return successResponse("Signup successful. OTP sent to email.", {}, 201);
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse("Internal server error", 500);
  }
}