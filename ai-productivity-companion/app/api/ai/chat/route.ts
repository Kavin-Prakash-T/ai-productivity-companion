import groq, { GROQ_MODEL } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import Habit from "@/models/Habit";
import { errorResponse, successResponse } from "@/utils/apiResponse";

type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const { message, history = [] } = await request.json();

        if (!message?.trim()) {
            return errorResponse("Message is required", 400);
        }

        if (!Array.isArray(history)) {
            return errorResponse("History must be an array", 400);
        }

        // Validate history shape
        const validRoles = ["user", "assistant"];
        for (const msg of history) {
            if (
                !msg ||
                typeof msg !== "object" ||
                !validRoles.includes(msg.role) ||
                typeof msg.content !== "string"
            ) {
                return errorResponse("Invalid message history format", 400);
            }
        }

        // Limit history to last 20 messages to avoid token overflow
        const trimmedHistory: ChatMessage[] = (history as ChatMessage[])
            .slice(-20)
            .map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

        // Fetch user context to personalize responses
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
            temperature: 0.5,
            max_tokens: 800,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful AI productivity assistant integrated into the user's personal productivity app.

You help users with:
- Managing tasks, goals, and habits
- Productivity advice and time management
- Motivation and focus strategies
- Answering questions about their data

Current user context:
${contextSummary}

Guidelines:
- Be concise, friendly, and practical
- Reference the user's actual tasks/goals/habits when relevant
- Do not make up data not in the context
- Respond in plain text (no markdown unless specifically needed)
- Keep responses under 200 words unless the user asks for detail`,
                },
                ...trimmedHistory,
                {
                    role: "user",
                    content: message.trim(),
                },
            ],
        });

        const reply =
            completion.choices[0]?.message?.content?.trim() ||
            "I'm sorry, I couldn't generate a response. Please try again.";

        return successResponse("Message sent successfully", {
            reply,
            usage: {
                promptTokens: completion.usage?.prompt_tokens ?? 0,
                completionTokens: completion.usage?.completion_tokens ?? 0,
            },
        });
    } catch (error) {
        console.error("Chat message error:", error);

        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Unable to process your message", 500);
    }
}
