import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const authUser = getAuthUser(req);

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return errorResponse("Current and new passwords are required", 400);
    }

    if (newPassword.length < 6) {
      return errorResponse("New password must be at least 6 characters", 400);
    }

    const user = await User.findById(authUser.userId).select("+password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return errorResponse("Invalid current password", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse("Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Internal server error", 500);
  }
}
