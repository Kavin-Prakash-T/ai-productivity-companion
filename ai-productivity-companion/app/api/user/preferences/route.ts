import { successResponse } from "@/utils/apiResponse";

export async function PUT() {
    return successResponse("Preferences updated successfully", {
        preferences: {
            theme: "light",
            notificationsEnabled: true
        }
    });
}
