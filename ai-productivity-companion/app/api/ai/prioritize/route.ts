import mongoose from "mongoose";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task, { TaskPriority } from "@/models/Task";
import { parseAiJson } from "@/utils/parseAiJson";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type PrioritizedTask = {
    taskId: string;
    priority: TaskPriority;
    priorityScore: number;
    reason: string;
};

type PrioritizationResult = {
    prioritizedTasks: PrioritizedTask[];
};

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const tasks = await Task.find({
            user: authUser.userId,
            status: {
                $nin: ["completed", "cancelled"],
            },
        }).select(
            "title description category priority status dueDate estimatedMinutes"
        );

        if (tasks.length === 0) {
            return errorResponse(
                "No active tasks available for prioritization",
                400
            );
        }

        const taskData = tasks.map((task) => ({
            taskId: task._id.toString(),
            title: task.title,
            description: task.description || "",
            category: task.category || "General",
            currentPriority: task.priority,
            status: task.status,
            dueDate: task.dueDate || null,
            estimatedMinutes: task.estimatedMinutes || null,
        }));

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
You are an intelligent task-prioritization assistant.

Analyze tasks using:
1. Deadline urgency
2. Importance
3. Estimated effort
4. Current task status
5. Risk of missing the deadline

Return only valid JSON using this exact structure:

{
  "prioritizedTasks": [
    {
      "taskId": "MongoDB task id",
      "priority": "low | medium | high | urgent",
      "priorityScore": 0,
      "reason": "Short explanation"
    }
  ]
}

Rules:
- priorityScore must be from 0 to 100.
- Include every supplied task exactly once.
- Higher scores mean the task should be done earlier.
- Do not invent task IDs.
            `,
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            currentDate: new Date().toISOString(),
                            tasks: taskData,
                        }),
                    },
                ],
            });

        const result =
            parseAiJson<PrioritizationResult>(
                completion.choices[0]?.message?.content
            );

        const validPriorities: TaskPriority[] = [
            "low",
            "medium",
            "high",
            "urgent",
        ];

        const validResults =
            result.prioritizedTasks.filter((item) => {
                return (
                    mongoose.Types.ObjectId.isValid(item.taskId) &&
                    validPriorities.includes(item.priority) &&
                    Number(item.priorityScore) >= 0 &&
                    Number(item.priorityScore) <= 100
                );
            });

        await Promise.all(
            validResults.map((item) =>
                Task.findOneAndUpdate(
                    {
                        _id: item.taskId,
                        user: authUser.userId,
                    },
                    {
                        priority: item.priority,
                        priorityScore: Math.round(
                            Number(item.priorityScore)
                        ),
                    }
                )
            )
        );

        const updatedTasks = await Task.find({
            user: authUser.userId,
            status: {
                $nin: ["completed", "cancelled"],
            },
        }).sort({
            priorityScore: -1,
            dueDate: 1,
        });

        const reasons = new Map(
            validResults.map((item) => [
                item.taskId,
                item.reason,
            ])
        );

        const prioritizedTasks = updatedTasks.map(
            (task) => ({
                task,
                reason:
                    reasons.get(task._id.toString()) ||
                    "Prioritized using deadline and workload.",
            })
        );

        return successResponse(
            "Tasks prioritized successfully",
            {
                prioritizedTasks,
            }
        );
    } catch (error) {
        console.error("AI prioritization error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse(
            "Unable to prioritize tasks",
            500
        );
    }
}