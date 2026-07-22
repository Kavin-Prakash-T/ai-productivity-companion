import api from "@/lib/api";

export const getEvents = () =>
    api.get("/calendar");

export const getEvent = (id: string) =>
    api.get(`/calendar/${id}`);

export const createEvent = (data: any) =>
    api.post("/calendar", data);

export const updateEvent = (
    id: string,
    data: any
) => api.put(`/calendar/${id}`, data);

export const deleteEvent = (id: string) =>
    api.delete(`/calendar/${id}`);