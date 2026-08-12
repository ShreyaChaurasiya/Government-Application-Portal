import axios from "axios";
import { readStoredUser } from "../utils/authStorage";

const api = axios.create({
    baseURL: import.meta.env.DEV ? "" : "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
  const stored = readStoredUser();
  if (stored?.token) {
    config.headers.Authorization = `Bearer ${stored.token}`;
  }
  return config;
});

export default api;
