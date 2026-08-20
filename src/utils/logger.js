/**
 * Lightweight frontend logger — mirrors backend log levels for debugging.
 * In production builds, debug/info are suppressed unless VITE_DEBUG_LOGS=true.
 */

const isDev = import.meta.env.DEV;
const forceLogs = import.meta.env.VITE_DEBUG_LOGS === "true";

function shouldLog(level) {
  if (forceLogs) return true;
  if (!isDev) return level === "warn" || level === "error";
  return true;
}

function formatMessage(level, message, ...args) {
  const time = new Date().toISOString();
  return [`[${time}] [${level.toUpperCase()}] ${message}`, ...args];
}

export const logger = {
  debug(message, ...args) {
    if (shouldLog("debug")) console.debug(...formatMessage("debug", message, ...args));
  },
  info(message, ...args) {
    if (shouldLog("info")) console.info(...formatMessage("info", message, ...args));
  },
  warn(message, ...args) {
    if (shouldLog("warn")) console.warn(...formatMessage("warn", message, ...args));
  },
  error(message, ...args) {
    if (shouldLog("error")) console.error(...formatMessage("error", message, ...args));
  },
};

export default logger;
