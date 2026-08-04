import groq, { GROQ_MODEL } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import Habit from "@/models/Habit";
import { parseAiJson } from "@/utils/parseAiJson";
import { errorResponse, successResponse } from "@/utils/apiResponse";

type InsightsResult = {
    insight: string;
};

export async function GET(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const now = new Date();
        const [activeTasks, goals, habits] = await Promise.all([
            Task.find({
                user: authUser.userId,
                status: { $in: ["pending", "in-progress"] },
            })
                .select("title priority dueDate status")
                .limit(10)
                .sort({ dueDate: 1 }),

            Goal.find({
                user: authUser.userId,
                status: { $in: ["not-started", "in-progress"] },
            })
                .select("title progress targetDate status")
                .limit(5),

            Habit.find({
                user: authUser.userId,
                isActive: true,
            })
                .select("title currentStreak frequency")
                .limit(5),
        ]);

        const contextSummary = JSON.stringify({
            currentDate: now.toISOString(),
            activeTasks: activeTasks.map((t) => ({
                title: t.title,
                priority: t.priority,
                dueDate: t.dueDate ?? null,
                status: t.status,
            })),
            goals: goals.map((g) => ({
                title: g.title,
                progress: g.progress,
                targetDate: g.targetDate ?? null,
                status: g.status,
            })),
            habits: habits.map((h) => ({
                title: h.title,
                currentStreak: h.currentStreak,
                frequency: h.frequency,
            })),
        });

        const completion = await groq.chat.completions.create({
            model: GROQ_MODEL,
            temperature: 0.6,
            response_format: {
                type: "json_object",
            },
            messages: [
                {
                    role: "system",
                    content: `You are a personalized productivity coach. Analyze the user's current tasks, habits, and goals and provide a friendly, motivating, and highly specific productivity insight (2-4 sentences, under 80 words) for the user to optimize their day.

Return only valid JSON in this exact structure:
{
  "insight": "Your personalized insight string here..."
}

Rules:
- Speak directly to the user (use "you").
- Reference their actual tasks/goals/habits when relevant.
- Do not make up tasks/goals/habits not present in the user context.
- Keep the tone encouraging, specific, and actionable.
- If they have no tasks, goals, or habits, encourage them to create their first task or habit to get started.`,
                },
                {
                    role: "user",
                    content: contextSummary,
                },
            ],
        });

        const result = parseAiJson<InsightsResult>(
            completion.choices[0]?.message?.content
        );

        return successResponse("Productivity insights generated successfully", {
            insight: result.insight || "Keep going! You're doing great.",
        });
    } catch (error) {
        console.error("AI insights error:", error);

        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Unable to generate productivity insights", 500);
    }
}
