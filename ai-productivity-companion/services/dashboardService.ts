import api from "@/lib/api";

export const getDashboard = () =>
    api.get("/dashboard");

export const getStatistics = () =>
    api.get("/dashboard/stats");

export const getRecentTasks = () =>
    api.get("/dashboard/recent-tasks");

export const getAIRecommendation = () =>
    api.get("/dashboard/ai-recommendation");