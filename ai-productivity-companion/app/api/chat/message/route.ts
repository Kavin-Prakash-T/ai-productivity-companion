import { successResponse } from "@/utils/apiResponse";

export async function POST() {
    return successResponse("Message sent successfully", {
        reply: "I am your AI productivity assistant. Ask me anything!"
    });
}
