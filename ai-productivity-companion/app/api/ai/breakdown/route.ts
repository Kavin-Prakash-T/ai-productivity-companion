import mongoose from "mongoose";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import { parseAiJson } from "@/utils/parseAiJson";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type BreakdownSubtask = {
    title: string;
    estimatedMinutes: number;
    order: number;
};

type BreakdownResult = {
    summary: string;
    subtasks: BreakdownSubtask[];
};

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const {
            taskId,
            saveSubtasks = false,
        } = await request.json();

        if (
            !taskId ||
            !mongoose.Types.ObjectId.isValid(taskId)
        ) {
            return errorResponse("Valid task ID is required", 400);
        }

        const task = await Task.findOne({
            _id: taskId,
            user: authUser.userId,
        });

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        const completion =
            await groq.chat.completions.create({
                model: GROQ_MODEL,
                temperature: 0.3,
                response_format: {
                    type: "json_object",
                },
                messages: [
                    {
                        role: "system",
                        content: `
                    You are an AI task-planning assistant.
                    
                    Break one large task into small, practical, ordered subtasks.
                    
                    Return only valid JSON:
                    
                    {
                      "summary": "Short task execution strategy",
                      "subtasks": [
                        {
                          "title": "Actionable subtask",
                          "estimatedMinutes": 30,
                          "order": 1
                        }
                      ]
                    }
                    
                    Rules:
                    - Generate between 3 and 10 subtasks.
                    - Every title must begin with an action verb.
                    - Do not create vague steps.
                    - estimatedMinutes must be at least 5.
                    - Order must start from 1.
                                `,
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            currentDate: new Date().toISOString(),
                            task: {
                                title: task.title,
                                description: task.description || "",
                                category: task.category,
                                dueDate: task.dueDate || null,
                                estimatedMinutes:
                                    task.estimatedMinutes || null,
                            },
                        }),
                    },
                ],
            });

        const result = parseAiJson<BreakdownResult>(
            completion.choices[0]?.message?.content
        );

        const subtasks = result.subtasks
            .filter(
                (subtask) =>
                    subtask.title?.trim() &&
                    Number(subtask.estimatedMinutes) >= 5
            )
            .sort((a, b) => a.order - b.order);

        if (saveSubtasks) {
            const existingTitles = new Set(
                task.subtasks.map((subtask) =>
                    subtask.title.toLowerCase()
                )
            );

            const newSubtasks = subtasks
                .filter(
                    (subtask) =>
                        !existingTitles.has(
                            subtask.title.toLowerCase()
                        )
                )
                .map((subtask) => ({
                    title: subtask.title.trim(),
                    completed: false,
                }));

            task.subtasks.push(...newSubtasks);
            task.aiGenerated = true;

            await task.save();
        }

        return successResponse(
            saveSubtasks
                ? "Task broken down and subtasks saved"
                : "Task breakdown generated successfully",
            {
                taskId: task._id,
                summary: result.summary,
                subtasks,
                saved: Boolean(saveSubtasks),
                task: saveSubtasks ? task : undefined,
            }
        );
    } catch (error) {
        console.error("AI breakdown error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse(
            "Unable to generate task breakdown",
            500
        );
    }
}