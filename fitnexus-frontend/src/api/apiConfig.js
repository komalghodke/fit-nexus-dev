import axios from "axios";

export const API_URL = "http://localhost:8083/api";

// Centralised axios instance with baseURL and JSON headers
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
