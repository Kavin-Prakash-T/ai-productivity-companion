import { successResponse } from "@/utils/apiResponse";

export async function GET() {
    return successResponse("Chat history fetched successfully", { messages: [] });
}
