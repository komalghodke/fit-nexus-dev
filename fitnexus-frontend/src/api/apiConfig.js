import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8083/api";
export const CORPORATE_URL = process.env.REACT_APP_CORPORATE_URL || "http://localhost:5294";

// Centralised axios instance with baseURL and JSON headers
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// ── Global 401 / 403 interceptor ────────────────────────────────────────────
// Fires on every axios call (not just `api`) so that raw axios.get() calls
// are also protected.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      const isLoginPage = window.location.pathname === "/login";
      if (!isLoginPage) {
        localStorage.clear();
        sessionStorage.setItem("sessionExpired", "true");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

