import axios from "axios";
const API_URL = "http://localhost:8080/api";

export async function fetchReport(userId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login again.");

  const res = await axios.get(`${API_URL}/reports/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
