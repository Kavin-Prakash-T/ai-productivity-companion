import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/utils/apiResponse";

export async function GET(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        const user = await User.findById(authUser.userId).select("-password");
        if (!user) {
            return errorResponse("User not found", 404);
        }

        return successResponse("Profile fetched successfully", { user });
    } catch (error) {
        console.error("GET profile error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}

export async function PUT(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        const { name, email } = await request.json();

        if (!name?.trim()) {
            return errorResponse("Name is required", 400);
        }
        if (!email?.trim()) {
            return errorResponse("Email is required", 400);
        }

        // Check if email is already taken by another user
        const existing = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: authUser.userId }
        });

        if (existing) {
            return errorResponse("Email is already taken", 400);
        }

        const updatedUser = await User.findByIdAndUpdate(
            authUser.userId,
            { name: name.trim(), email: email.toLowerCase() },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return errorResponse("User not found", 404);
        }

        return successResponse("Profile updated successfully", { user: updatedUser });
    } catch (error) {
        console.error("PUT profile error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}
