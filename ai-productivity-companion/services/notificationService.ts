import api from "@/lib/api";

export const getNotifications = () =>
    api.get("/notifications");

export const markAsRead = (id: string) =>
    api.patch(`/notifications/${id}/read`);

export const deleteNotification = (id: string) =>
    api.delete(`/notifications/${id}`);

export const markAllRead = () =>
    api.patch("/notifications/read-all");