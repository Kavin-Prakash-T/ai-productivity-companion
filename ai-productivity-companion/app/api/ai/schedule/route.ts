import groq, { GROQ_MODEL } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Habit from "@/models/Habit";
import { parseAiJson } from "@/utils/parseAiJson";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type ScheduledBlock = {
    taskId: string;
    title: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    reason: string;
};

type ScheduleResult = {
    date: string;
    totalScheduledMinutes: number;
    schedule: ScheduledBlock[];
    unscheduledTaskIds: string[];
    advice: string;
};

function isValidTime(value: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const {
            date,
            workStart = "09:00",
            workEnd = "18:00",
            breakMinutes = 10,
        } = await request.json();

        const scheduleDate =
            date || new Date().toISOString().split("T")[0];

        if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduleDate)) {
            return errorResponse(
                "Date must use YYYY-MM-DD format",
                400
            );
        }

        if (
            !isValidTime(workStart) ||
            !isValidTime(workEnd)
        ) {
            return errorResponse(
                "Working hours must use HH:mm format",
                400
            );
        }

        if (
            Number(breakMinutes) < 0 ||
            Number(breakMinutes) > 60
        ) {
            return errorResponse(
                "Break duration must be between 0 and 60 minutes",
                400
            );
        }

        const [tasks, habits] = await Promise.all([
            Task.find({
                user: authUser.userId,
                status: {
                    $in: ["pending", "in-progress"],
                },
            })
                .select(
                    "title description priority priorityScore dueDate estimatedMinutes status"
                )
                .sort({
                    priorityScore: -1,
                    dueDate: 1,
                }),

            Habit.find({
                user: authUser.userId,
                isActive: true,
                reminderEnabled: true,
            }).select("title reminderTime frequency targetDays"),
        ]);

        if (tasks.length === 0) {
            return errorResponse(
                "No active tasks available for scheduling",
                400
            );
        }

        const completion =
            await groq.chat.completions.create({
                model: GROQ_MODEL,
                temperature: 0.2,
                response_format: {
                    type: "json_object",
                },
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI scheduling assistant.

Create a realistic one-day time-block schedule.

Return only valid JSON:

{
  "date": "YYYY-MM-DD",
  "totalScheduledMinutes": 0,
  "schedule": [
    {
      "taskId": "Task id",
      "title": "Task title",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "durationMinutes": 30,
      "reason": "Why this slot was selected"
    }
  ],
  "unscheduledTaskIds": [],
  "advice": "Short productivity advice"
}

Rules:
- Never schedule outside working hours.
- Do not overlap schedule blocks.
- Add the requested break between long work sessions.
- Prioritize urgent deadlines and high scores.
- Use only provided task IDs.
- If all tasks cannot fit, include remaining IDs in unscheduledTaskIds.
- Do not schedule more time than each task's estimated duration.
            `,
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            date: scheduleDate,
                            workingHours: {
                                start: workStart,
                                end: workEnd,
                            },
                            breakMinutes: Number(breakMinutes),
                            tasks: tasks.map((task) => ({
                                taskId: task._id.toString(),
                                title: task.title,
                                description: task.description || "",
                                priority: task.priority,
                                priorityScore:
                                    task.priorityScore || 0,
                                dueDate: task.dueDate || null,
                                estimatedMinutes:
                                    task.estimatedMinutes || 30,
                                status: task.status,
                            })),
                            habitReminders: habits,
                        }),
                    },
                ],
            });

        const result = parseAiJson<ScheduleResult>(
            completion.choices[0]?.message?.content
        );

        return successResponse(
            "AI schedule generated successfully",
            {
                schedule: result,
            }
        );
    } catch (error) {
        console.error("AI schedule error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse(
            "Unable to generate schedule",
            500
        );
    }
}