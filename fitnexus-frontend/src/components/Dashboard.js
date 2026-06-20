import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Session expired, please login again.");
        localStorage.removeItem("token");
        window.location.replace("/login");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login"); // ✅ avoids loop
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>No profile data available.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {profile.name}</h2>
      <p>Email: {profile.email}</p>

      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Cards for modules */}
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Workout</h3>
          <button disabled>Coming Soon</button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Nutrition</h3>
          <button disabled>Coming Soon</button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Sleep</h3>
          <button disabled>Coming Soon</button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Stress</h3>
          <button disabled>Coming Soon</button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Profile</h3>
          <button onClick={() => (window.location.href = "/profile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
