import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import CalendarEvent, { CalendarEventType } from "@/models/CalendarEvent";
import { errorResponse, successResponse } from "@/utils/apiResponse";

export async function GET(request: Request) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);

        const url = new URL(request.url);

        // Support optional date range filters: ?start=YYYY-MM-DD&end=YYYY-MM-DD
        // If not provided, defaults to returning the current month's events
        const startParam = url.searchParams.get("start");
        const endParam = url.searchParams.get("end");

        const now = new Date();

        let startDate: Date;
        let endDate: Date;

        if (startParam) {
            startDate = new Date(`${startParam}T00:00:00`);
            if (Number.isNaN(startDate.getTime())) {
                return errorResponse("Invalid start date. Use YYYY-MM-DD format.", 400);
            }
        } else {
            // Default: start of current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        if (endParam) {
            endDate = new Date(`${endParam}T23:59:59.999`);
            if (Number.isNaN(endDate.getTime())) {
                return errorResponse("Invalid end date. Use YYYY-MM-DD format.", 400);
            }
        } else {
            // Default: end of current month
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        if (endDate < startDate) {
            return errorResponse("End date must be after start date", 400);
        }

        const events = await CalendarEvent.find({
            user: authUser.userId,
            startTime: { $lte: endDate },
            endTime: { $gte: startDate },
        }).sort({ startTime: 1 });

        return successResponse("Calendar events fetched successfully", {
            events,
            count: events.length,
            range: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            },
        });
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

        if (!date) {
            return errorResponse("Date is required", 400);
        }

        if (!allDay && !time) {
            return errorResponse("Time is required for non-all-day events", 400);
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return errorResponse("Date must use YYYY-MM-DD format", 400);
        }

        // Construct startTime and endTime
        const timeStr = allDay ? "00:00" : time;
        const startTime = new Date(`${date}T${timeStr}:00`);
        if (Number.isNaN(startTime.getTime())) {
            return errorResponse("Invalid date or time", 400);
        }

        const endTime = new Date(startTime.getTime() + Number(duration) * 60 * 1000);

        const validTypes: CalendarEventType[] = [
            "meeting",
            "interview",
            "class",
            "appointment",
            "personal",
            "other"
        ];

        const eventType = type && validTypes.includes(type) ? type : "other";

        if (reminderEnabled && (Number(reminderMinutesBefore) < 0 || Number(reminderMinutesBefore) > 10080)) {
            return errorResponse("Reminder minutes must be between 0 and 10080", 400);
        }

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
