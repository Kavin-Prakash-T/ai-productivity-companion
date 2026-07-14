import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Notification from "@/models/Notification";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

export async function GET(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const url = new URL(request.url);

        const unreadOnly =
            url.searchParams.get("unreadOnly") ===
            "true";

        const page = Math.max(
            Number(url.searchParams.get("page") || 1),
            1
        );

        const limit = Math.min(
            Math.max(
                Number(
                    url.searchParams.get("limit") || 20
                ),
                1
            ),
            100
        );

        const query: Record<string, unknown> = {
            user: authUser.userId,
        };

        if (unreadOnly) {
            query.isRead = false;
        }

        const [notifications, total, unreadCount] =
            await Promise.all([
                Notification.find(query)
                    .sort({
                        createdAt: -1,
                    })
                    .skip((page - 1) * limit)
                    .limit(limit),

                Notification.countDocuments(query),

                Notification.countDocuments({
                    user: authUser.userId,
                    isRead: false,
                }),
            ]);

        return successResponse(
            "Notifications fetched successfully",
            {
                notifications,
                unreadCount,

                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(
                        total / limit
                    ),
                },
            }
        );
    } catch (error) {
        console.error(
            "Get notifications error:",
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

export async function PATCH(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        await Notification.updateMany(
            {
                user: authUser.userId,
                isRead: false,
            },
            {
                isRead: true,
            }
        );

        return successResponse(
            "All notifications marked as read"
        );
    } catch (error) {
        console.error(
            "Mark all notifications error:",
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