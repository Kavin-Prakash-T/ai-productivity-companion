import api from "@/lib/api";

export const changePassword = (data: any) =>
    api.put("/auth/change-password", data);

export const logout = () =>
    api.post("/auth/logout");

export const updatePreferences = (data: any) =>
    api.put("/user/preferences", data);