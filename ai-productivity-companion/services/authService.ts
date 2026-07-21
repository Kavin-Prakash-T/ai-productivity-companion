import api from "@/lib/api";
import {
  LoginData,
  RegisterData,
  VerifyOtpData,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/types/auth";

export const registerUser = (data: RegisterData) =>
  api.post("/auth/register", data);

export const verifyEmail = (data: VerifyOtpData) =>
  api.post("/auth/verify-email", data);

export const loginUser = (data: LoginData) =>
  api.post("/auth/login", data);

export const forgotPassword = (
  data: ForgotPasswordData
) => api.post("/auth/forgot-password", data);

export const resetPassword = (
  data: ResetPasswordData
) => api.post("/auth/reset-password", data);

export const logoutUser = () =>
  api.post("/auth/logout");