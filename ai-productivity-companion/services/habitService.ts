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

export const checkInHabit = (id: string) =>
    api.patch(`/habits/${id}/check-in`);