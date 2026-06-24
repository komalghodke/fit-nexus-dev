import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>📊 FitNexus Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/reports">Wellness Reports</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/workout">Workout Log (coming soon)</Link></li>
          <li><Link to="/nutrition">Nutrition Log (coming soon)</Link></li>
          <li><Link to="/sleep">Sleep Log (coming soon)</Link></li>
          <li><Link to="/stress">Stress Log (coming soon)</Link></li>
        </ul>
      </nav>
    </div>
  );
}
export default Dashboard;
