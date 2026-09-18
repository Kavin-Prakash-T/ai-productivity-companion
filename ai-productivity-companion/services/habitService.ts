import api from "@/lib/api";

export const getHabits = () =>
    api.get("/habits");

export const getHabit = (id: string) =>
    api.get(`/habits/${id}`);

export const createHabit = (data: any) =>
    api.post("/habits", data);

export const updateHabit = (
    id: string,
    data: any
) => api.put(`/habits/${id}`, data);

export const deleteHabit = (id: string) =>
    api.delete(`/habits/${id}`);

export const checkInHabit = (id: string, date?: string) =>
    api.patch(`/habits/${id}/check-in`, date ? { date } : undefined);

export const uncheckInHabit = (id: string, date?: string) =>
    api.delete(`/habits/${id}/check-in`, { data: date ? { date } : undefined });