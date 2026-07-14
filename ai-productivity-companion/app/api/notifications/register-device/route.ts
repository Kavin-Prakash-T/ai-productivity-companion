import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { token } = await request.json();

        if (
            !token ||
            typeof token !== "string" ||
            !token.trim()
        ) {
            return errorResponse(
                "FCM token is required",
                400
            );
        }

        const user = await User.findByIdAndUpdate(
            authUser.userId,
            {
                $addToSet: {
                    fcmTokens: token.trim(),
                },
            },
            {
                new: true,
            }
        ).select("name email fcmTokens");

        if (!user) {
            return errorResponse("User not found", 404);
        }

        return successResponse(
            "Device registered successfully",
            {
                registeredDevices:
                    user.fcmTokens.length,
            }
        );
    } catch (error) {
        console.error(
            "Register device error:",
            error
        );

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse(
            "Internal server error",
            500
        );
    }
}

export async function DELETE(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { token } = await request.json();

        if (!token) {
            return errorResponse(
                "FCM token is required",
                400
            );
        }

        const user = await User.findByIdAndUpdate(
            authUser.userId,
            {
                $pull: {
                    fcmTokens: token,
                },
            },
            {
                new: true,
            }
        ).select("fcmTokens");

        if (!user) {
            return errorResponse("User not found", 404);
        }

        return successResponse(
            "Device removed successfully",
            {
                registeredDevices:
                    user.fcmTokens.length,
            }
        );
    } catch (error) {
        console.error("Remove device error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse(
            "Internal server error",
            500
        );
    }
}