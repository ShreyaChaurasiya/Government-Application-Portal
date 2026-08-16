import api from "../api/api";

export const login = (email, password) =>
  api.post("/api/auth/login", { email, password });

export const signup = ({ name, email, password, role, companyName }) =>
  api.post("/api/auth/register", { name, email, password, role, companyName });

export const verifyEmail = (token) =>
  api.get("/api/auth/verify", { params: { token } });

export const logoutApi = (refreshToken) =>
  api.post("/api/auth/logout", { refreshToken });
