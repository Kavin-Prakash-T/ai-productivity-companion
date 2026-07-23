import api from "@/lib/api";

export const sendMessage = (message: string) =>
    api.post("/ai/chat", { message });

export const prioritizeTasks = () =>
    api.get("/ai/prioritize");

export const generateSchedule = () =>
    api.get("/ai/schedule");

export const productivityInsights = () =>
    api.get("/ai/insights");

export const breakTask = (taskId: string) =>
    api.post(`/ai/break-task/${taskId}`);