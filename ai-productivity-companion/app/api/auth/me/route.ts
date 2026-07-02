import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse("User fetched successfully", { user });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("Unauthorized", 401);
  }
}