import api from "@/lib/api";

export const getGoals = () =>
    api.get("/goals");

export const getGoal = (id: string) =>
    api.get(`/goals/${id}`);

export const createGoal = (data: any) =>
    api.post("/goals", data);

export const updateGoal = (
    id: string,
    data: any
) => api.put(`/goals/${id}`, data);

export const deleteGoal = (id: string) =>
    api.delete(`/goals/${id}`);

export const updateProgress = (
    id: string,
    progress: number
) =>
    api.patch(`/goals/${id}/progress`, {
        progress,
    });