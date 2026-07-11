import groq, { GROQ_MODEL } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import Habit from "@/models/Habit";
import { parseAiJson } from "@/utils/parseAiJson";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type Recommendation = {
    type:
    | "task"
    | "goal"
    | "habit"
    | "schedule"
    | "focus";
    title: string;
    message: string;
    action: string;
    priority: "low" | "medium" | "high";
};

type RecommendationResult = {
    productivitySummary: string;
    strengths: string[];
    areasToImprove: string[];
    recommendations: Recommendation[];
};

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const now = new Date();

        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 30
        );

        const [
            activeTasks,
            completedTasks,
            missedTasks,
            goals,
            habits,
        ] = await Promise.all([
            Task.find({
                user: authUser.userId,
                status: {
                    $in: ["pending", "in-progress"],
                },
            }).select(
                "title priority priorityScore dueDate estimatedMinutes status"
            ),

            Task.find({
                user: authUser.userId,
                status: "completed",
                completedAt: {
                    $gte: thirtyDaysAgo,
                },
            }).select(
                "title completedAt estimatedMinutes dueDate"
            ),

            Task.find({
                user: authUser.userId,
                $or: [
                    {
                        status: "missed",
                    },
                    {
                        dueDate: {
                            $lt: now,
                        },
                        status: {
                            $nin: ["completed", "cancelled"],
                        },
                    },
                ],
            }).select(
                "title dueDate priority estimatedMinutes status"
            ),

            Goal.find({
                user: authUser.userId,
            }).select(
                "title progress status targetDate category"
            ),

            Habit.find({
                user: authUser.userId,
                isActive: true,
            }).select(
                "title frequency currentStreak longestStreak totalCompletions completionLogs"
            ),
        ]);

        const completion =
            await groq.chat.completions.create({
                model: GROQ_MODEL,
                temperature: 0.4,
                response_format: {
                    type: "json_object",
                },
                messages: [
                    {
                        role: "system",
                        content: `
You are a personalized productivity coach.

Study the user's tasks, goals and habits and provide useful, specific advice.

Return only valid JSON:

{
  "productivitySummary": "Short overall assessment",
  "strengths": ["Strength"],
  "areasToImprove": ["Area"],
  "recommendations": [
    {
      "type": "task | goal | habit | schedule | focus",
      "title": "Recommendation title",
      "message": "Personalized explanation",
      "action": "Specific next action",
      "priority": "low | medium | high"
    }
  ]
}

Rules:
- Produce between 3 and 6 recommendations.
- Avoid generic motivation.
- Recommendations must be based on supplied data.
- Focus on actions the user can perform immediately.
- Do not shame the user for incomplete work.
            `,
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            currentDate: now.toISOString(),
                            analysisPeriod: {
                                start: thirtyDaysAgo.toISOString(),
                                end: now.toISOString(),
                            },
                            activeTasks,
                            completedTasks,
                            missedOrOverdueTasks: missedTasks,
                            goals,
                            habits: habits.map((habit) => ({
                                title: habit.title,
                                frequency: habit.frequency,
                                currentStreak:
                                    habit.currentStreak,
                                longestStreak:
                                    habit.longestStreak,
                                totalCompletions:
                                    habit.totalCompletions,
                                recentCompletions:
                                    habit.completionLogs.filter(
                                        (log) =>
                                            new Date(
                                                `${log.date}T00:00:00.000Z`
                                            ) >= thirtyDaysAgo
                                    ).length,
                            })),
                        }),
                    },
                ],
            });

        const result =
            parseAiJson<RecommendationResult>(
                completion.choices[0]?.message?.content
            );

        return successResponse(
            "Recommendations generated successfully",
            result
        );
    } catch (error) {
        console.error(
            "AI recommendations error:",
            error
        );

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse(
            "Unable to generate recommendations",
            500
        );
    }
}