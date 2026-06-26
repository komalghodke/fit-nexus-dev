import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 FitNexus Wellness Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Link to="/reports" style={cardStyle}>Wellness Reports</Link>
        <Link to="/profile" style={cardStyle}>Profile</Link>
        <Link to="/workout" style={cardStyle}>Workout Log</Link>
        <Link to="/nutrition" style={cardStyle}>Nutrition Log</Link>
        <Link to="/sleep" style={cardStyle}>Sleep Log</Link>
        <Link to="/stress" style={cardStyle}>Stress Log</Link>
        <Link to="/wellness" className="card">🌿 Wellness Assessment</Link>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
  flex: "1 1 200px",
  textDecoration: "none",
  color: "#333",
  fontWeight: "bold"
};

export default Dashboard;
