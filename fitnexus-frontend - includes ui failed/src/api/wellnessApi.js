import axios from "axios";

const API_URL = "http://localhost:8080/api";

export async function saveWellnessInput(inputs) {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/wellness-input`, inputs, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
