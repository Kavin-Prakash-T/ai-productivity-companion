import { getAuthUser } from "@/lib/getAuthUser";
import { errorResponse, successResponse } from "@/utils/apiResponse";

/**
 * GET /api/chat/history
 *
 * Chat history is stored client-side (in localStorage or component state).
 * This endpoint validates auth and returns an empty array to confirm the
 * session is valid; the client is responsible for persisting chat history.
 */
export async function GET(request: Request) {
    try {
        // Validate auth token — throws "Unauthorized" if invalid
        getAuthUser(request);

        return successResponse("Chat history fetched successfully", {
            messages: [],
            note: "Chat history is managed client-side. Pass previous messages in the 'history' field of POST /api/chat/message.",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}
