import api from "@/lib/api";

export const sendMessage = (message: string) =>
    api.post("/ai/chat", { message });

export const productivityInsights = () =>
    api.get("/ai/insights");

export const breakTask = (taskId: string, saveSubtasks: boolean = true) =>
    api.post("/ai/breakdown", { taskId, saveSubtasks });