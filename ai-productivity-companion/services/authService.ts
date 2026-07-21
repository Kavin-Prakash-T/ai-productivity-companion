import api from "@/lib/api";

export const registerUser = (data: any) =>
  api.post("/auth/register", data);

export const verifyEmail = (data: any) =>
  api.post("/auth/verify-email", data);

export const loginUser = (data: any) =>
  api.post("/auth/login", data);

export const forgotPassword = (data: any) =>
  api.post("/auth/forgot-password", data);

export const resetPassword = (data: any) =>
  api.post("/auth/reset-password", data);

export const logoutUser = () =>
  api.post("/auth/logout");