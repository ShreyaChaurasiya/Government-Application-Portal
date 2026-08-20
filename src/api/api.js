import axios from "axios";
import { readStoredUser } from "../utils/authStorage";
import logger from "../utils/logger";
import { getApiErrorMessage } from "../utils/apiError";

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
  logger.debug("API request", config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    logger.debug("API response", response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() ?? "REQUEST";
    const url = error.config?.url ?? "unknown";
    const status = error.response?.status;
    const message = getApiErrorMessage(error, error.message);
    logger.error("API error", method, url, status ?? "network", message);
    return Promise.reject(error);
  }
);

export default api;
