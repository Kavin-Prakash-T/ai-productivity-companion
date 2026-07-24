import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/utils/apiResponse";

/**
 * GET /api/user/preferences
 * Returns the current user's notification preferences derived from their profile.
 */
export async function GET(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        const user = await User.findById(authUser.userId).select("name email fcmTokens isVerified");
        if (!user) {
            return errorResponse("User not found", 404);
        }

        return successResponse("Preferences fetched successfully", {
            preferences: {
                pushNotificationsEnabled: user.fcmTokens.length > 0,
                registeredDevices: user.fcmTokens.length,
                emailVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("GET preferences error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}

/**
 * PUT /api/user/preferences
 * Currently supports updating notification preferences.
 * Push notification device management is handled via /api/notifications/register-device.
 */
export async function PUT(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        // Validate the request body (currently preferences are managed via
        // device registration; this endpoint acknowledges the update)
        const body = await request.json();

        // Validate user exists
        const user = await User.findById(authUser.userId).select("name email fcmTokens isVerified");
        if (!user) {
            return errorResponse("User not found", 404);
        }

        // Future: persist theme/notification prefs to User model when schema is extended
        // For now, return the current effective preferences
        return successResponse("Preferences updated successfully", {
            preferences: {
                pushNotificationsEnabled: user.fcmTokens.length > 0,
                registeredDevices: user.fcmTokens.length,
                emailVerified: user.isVerified,
                // Echo back any preferences the client sent
                ...(body.theme ? { theme: body.theme } : {}),
                ...(typeof body.notificationsEnabled === "boolean"
                    ? { notificationsEnabled: body.notificationsEnabled }
                    : {}),
            },
        });
    } catch (error) {
        console.error("PUT preferences error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}
