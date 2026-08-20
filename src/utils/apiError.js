export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    if (typeof first === "string") return first;
  }

  if (!error?.response) {
    return "Cannot reach the server. Start the backend on port 8080 and try again.";
  }

  return fallback;
}
