import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import CalendarEvent from "@/models/CalendarEvent";
import ScheduleBlock from "@/models/ScheduleBlock";
import {
  errorResponse,
  successResponse,
} from "@/utils/apiResponse";

export async function POST(request: Request) {
  try {
    await connectDB();

    const authUser = getAuthUser(request);

    const {
      taskId,
      startTime,
      endTime,
      notes,
      aiGenerated = false,
    } = await request.json();

    if (
      !taskId ||
      !mongoose.Types.ObjectId.isValid(taskId)
    ) {
      return errorResponse("Valid task ID is required", 400);
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return errorResponse(
        "Valid start and end times are required",
        400
      );
    }

    if (endDate <= startDate) {
      return errorResponse(
        "End time must be after start time",
        400
      );
    }

    const task = await Task.findOne({
      _id: taskId,
      user: authUser.userId,
    });

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    if (
      ["completed", "cancelled"].includes(task.status)
    ) {
      return errorResponse(
        "Completed or cancelled tasks cannot be scheduled",
        400
      );
    }

    const conflictingEvent =
      await CalendarEvent.findOne({
        user: authUser.userId,
        startTime: { $lt: endDate },
        endTime: { $gt: startDate },
      });

    const conflictingBlock =
      await ScheduleBlock.findOne({
        user: authUser.userId,
        status: {
          $nin: ["cancelled", "completed"],
        },
        startTime: { $lt: endDate },
        endTime: { $gt: startDate },
      });

    if (conflictingEvent || conflictingBlock) {
      return errorResponse(
        "The selected time is already occupied",
        409
      );
    }

    const durationMinutes = Math.round(
      (endDate.getTime() - startDate.getTime()) /
      60000
    );

    const scheduleBlock = await ScheduleBlock.create({
      user: authUser.userId,
      task: task._id,
      title: task.title,
      startTime: startDate,
      endTime: endDate,
      durationMinutes,
      aiGenerated: Boolean(aiGenerated),
      notes: notes?.trim(),
    });

    if (task.status === "pending") {
      task.status = "in-progress";
      await task.save();
    }

    return successResponse(
      "Task scheduled successfully",
      { scheduleBlock },
      201
    );
  } catch (error) {
    console.error("Schedule task error:", error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return errorResponse("Unauthorized", 401);
    }

    return errorResponse("Internal server error", 500);
  }
}