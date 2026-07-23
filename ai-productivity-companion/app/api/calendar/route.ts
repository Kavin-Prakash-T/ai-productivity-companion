import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import CalendarEvent, { CalendarEventType } from "@/models/CalendarEvent";
import { errorResponse, successResponse } from "@/utils/apiResponse";

export async function GET(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        const events = await CalendarEvent.find({ user: authUser.userId }).sort({ startTime: 1 });

        return successResponse("Calendar events fetched successfully", { events });
    } catch (error) {
        console.error("GET calendar events error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        const {
            title,
            description,
            type,
            date,
            time,
            duration = 60, // default 60 mins
            location,
            allDay = false,
            reminderEnabled = false,
            reminderMinutesBefore = 30
        } = await request.json();

        if (!title?.trim()) {
            return errorResponse("Event title is required", 400);
        }

        if (!date || !time) {
            return errorResponse("Date and time are required", 400);
        }

        // Construct startTime and endTime
        const startTime = new Date(`${date}T${time}:00`);
        if (Number.isNaN(startTime.getTime())) {
            return errorResponse("Invalid date or time", 400);
        }

        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        const validTypes: CalendarEventType[] = [
            "meeting",
            "interview",
            "class",
            "appointment",
            "personal",
            "other"
        ];

        const eventType = type && validTypes.includes(type) ? type : "other";

        const event = await CalendarEvent.create({
            user: authUser.userId,
            title: title.trim(),
            description: description?.trim(),
            type: eventType,
            startTime,
            endTime,
            location: location?.trim(),
            allDay: Boolean(allDay),
            reminderEnabled: Boolean(reminderEnabled),
            reminderMinutesBefore: reminderEnabled ? Number(reminderMinutesBefore) : undefined
        });

        return successResponse("Event created successfully", { event }, 201);
    } catch (error) {
        console.error("POST calendar event error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}
