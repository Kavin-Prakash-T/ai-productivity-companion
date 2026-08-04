import api from "@/lib/api";

export const getTasks = () =>
    api.get("/tasks");

export const getTask = (id: string) =>
    api.get(`/tasks/${id}`);

export const createTask = (data: any) =>
    api.post("/tasks", data);

export const updateTask = (
    id: string,
    data: any
) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id: string) =>
    api.delete(`/tasks/${id}`);

export const completeTask = (id: string) =>
    api.patch(`/tasks/${id}/complete`);

export const getSubtasks = (taskId: string) =>
    api.get(`/tasks/${taskId}/subtasks`);

export const createSubtask = (taskId: string, title: string) =>
    api.post(`/tasks/${taskId}/subtasks`, { title });

export const updateSubtask = (
    taskId: string,
    subtaskId: string,
    data: { title?: string; completed?: boolean }
) => api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, data);

export const deleteSubtask = (taskId: string, subtaskId: string) =>
    api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);