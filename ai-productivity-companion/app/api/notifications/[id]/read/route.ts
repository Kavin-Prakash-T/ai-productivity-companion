import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Notification from "@/models/Notification";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(
                "Invalid notification ID",
                400
            );
        }

        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: id,
                    user: authUser.userId,
                },
                {
                    isRead: true,
                },
                {
                    new: true,
                }
            );

        if (!notification) {
            return errorResponse(
                "Notification not found",
                404
            );
        }

        return successResponse(
            "Notification marked as read",
            {
                notification,
            }
        );
    } catch (error) {
        console.error(
            "Read notification error:",
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