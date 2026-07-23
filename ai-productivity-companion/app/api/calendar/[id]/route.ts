import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import CalendarEvent, { CalendarEventType } from "@/models/CalendarEvent";
import { errorResponse, successResponse } from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(request: Request, context: RouteContext) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid event ID", 400);
        }

        const event = await CalendarEvent.findOne({
            _id: id,
            user: authUser.userId
        });

        if (!event) {
            return errorResponse("Event not found", 404);
        }

        return successResponse("Event fetched successfully", { event });
    } catch (error) {
        console.error("GET calendar event error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}

export async function PUT(request: Request, context: RouteContext) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid event ID", 400);
        }

        const body = await request.json();

        const updateData: Record<string, any> = {};

        if (body.title !== undefined) updateData.title = body.title.trim();
        if (body.description !== undefined) updateData.description = body.description.trim();
        if (body.location !== undefined) updateData.location = body.location.trim();
        if (body.allDay !== undefined) updateData.allDay = Boolean(body.allDay);
        if (body.reminderEnabled !== undefined) updateData.reminderEnabled = Boolean(body.reminderEnabled);
        if (body.reminderMinutesBefore !== undefined) updateData.reminderMinutesBefore = Number(body.reminderMinutesBefore);

        if (body.type) {
            const validTypes: CalendarEventType[] = [
                "meeting",
                "interview",
                "class",
                "appointment",
                "personal",
                "other"
            ];
            if (validTypes.includes(body.type)) {
                updateData.type = body.type;
            }
        }

        if (body.date && body.time) {
            const startTime = new Date(`${body.date}T${body.time}:00`);
            if (!Number.isNaN(startTime.getTime())) {
                updateData.startTime = startTime;
                const duration = body.duration ? Number(body.duration) : 60;
                updateData.endTime = new Date(startTime.getTime() + duration * 60 * 1000);
            }
        }

        const event = await CalendarEvent.findOneAndUpdate(
            { _id: id, user: authUser.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!event) {
            return errorResponse("Event not found", 404);
        }

        return successResponse("Event updated successfully", { event });
    } catch (error) {
        console.error("PUT calendar event error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    try {
        await connectDB();
        const authUser = getAuthUser(request);
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid event ID", 400);
        }

        const event = await CalendarEvent.findOneAndDelete({
            _id: id,
            user: authUser.userId
        });

        if (!event) {
            return errorResponse("Event not found", 404);
        }

        return successResponse("Event deleted successfully");
    } catch (error) {
        console.error("DELETE calendar event error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
}
