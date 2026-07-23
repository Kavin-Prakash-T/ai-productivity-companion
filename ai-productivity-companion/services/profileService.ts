import api from "@/lib/api";

export const getProfile = () =>
    api.get("/user/profile");

export const updateProfile = (data: any) =>
    api.put("/user/profile", data);

export const uploadAvatar = (data: FormData) =>
    api.post("/user/avatar", data);