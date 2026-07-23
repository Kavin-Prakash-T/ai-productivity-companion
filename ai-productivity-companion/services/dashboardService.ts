import api from "@/lib/api";

// Dashboard summary: tasks/goals/habits counts & rates
export const getDashboardSummary = () =>
    api.get("/dashboard/summary");

// Today's tasks and habits
export const getTodayData = () =>
    api.get("/dashboard/today");

// Upcoming deadlines (tasks + goals) in next N days
export const getUpcomingDeadlines = (days = 7) =>
    api.get(`/dashboard/upcoming-deadlines?days=${days}`);

// Productivity score and daily stats
export const getProductivity = (days = 7) =>
    api.get(`/dashboard/productivity?days=${days}`);