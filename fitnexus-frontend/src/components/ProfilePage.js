import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const emailStored = localStorage.getItem("email");
    if (!token || !emailStored) {
      window.location.href = "/login";
      return;
    }

    // ✅ Fetch profile on mount
    axios.get(`${API_URL}/users/profile/${emailStored}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProfile(res.data);
    })
    .catch(() => {
      alert("Failed to load profile");
    });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const emailStored = localStorage.getItem("email");

      // ✅ Send updated profile
      await axios.put(`${API_URL}/users/profile/${emailStored}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleUpdate} style={{ margin: "20px" }}>
      <h3>Update Profile</h3>
      <input
        type="text"
        name="name"
        value={profile.name || ""}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        type="email"
        name="email"
        value={profile.email || ""}
        onChange={handleChange}
        placeholder="Email"
        disabled
      />
      <input
        type="number"
        name="age"
        value={profile.age || ""}
        onChange={handleChange}
        placeholder="Age"
      />
      <input
        type="text"
        name="gender"
        value={profile.gender || ""}
        onChange={handleChange}
        placeholder="Gender"
      />
      <input
        type="number"
        name="height"
        value={profile.height || ""}
        onChange={handleChange}
        placeholder="Height (cm)"
      />
      <input
        type="number"
        name="weight"
        value={profile.weight || ""}
        onChange={handleChange}
        placeholder="Weight (kg)"
      />
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default ProfilePage;