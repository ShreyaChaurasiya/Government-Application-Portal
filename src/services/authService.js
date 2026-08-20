import api from "../api/api";

export const getCaptcha = () => api.get("/api/auth/captcha");

export const login = (payload) => api.post("/api/auth/login", payload);

export const signup = (payload) => api.post("/api/auth/register", payload);

export const verifyOtp = (payload) => api.post("/api/auth/verify-otp", payload);

export const resendOtp = (payload) => api.post("/api/auth/resend-otp", payload);

export const verifyEmail = (token) =>
  api.get("/api/auth/verify", { params: { token } });

export const forgotPassword = (payload) => api.post("/api/auth/forgot-password", payload);

export const resetPassword = (payload) => api.post("/api/auth/reset-password", payload);

export const logoutApi = (refreshToken) =>
  api.post("/api/auth/logout", { refreshToken });
