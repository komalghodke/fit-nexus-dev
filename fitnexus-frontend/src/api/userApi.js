import axios from "axios";

import { API_URL } from "./apiConfig";

// ✅ Fetch profile by username
export async function fetchProfile(username) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/users/profile/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// ✅ Fetch user by numeric ID
export async function fetchUserById(id) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
