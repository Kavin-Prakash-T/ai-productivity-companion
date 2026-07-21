export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}