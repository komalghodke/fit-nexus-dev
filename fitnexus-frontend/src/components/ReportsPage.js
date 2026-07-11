import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/apiConfig";

function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      window.location.replace("/login");
      return;
    }

    axios.get(`${API_URL}/reports/profile/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setReport(res.data))
    .catch(() => alert("Failed to load report"));
  }, []);

  if (!report) {
    return <p>Loading wellness report...</p>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <h2>Wellness Report</h2>
      <p><strong>Workout Summary:</strong> {report.workoutSummary}</p>
      <p><strong>Nutrition Summary:</strong> {report.nutritionSummary}</p>
      <p><strong>Sleep Summary:</strong> {report.sleepSummary}</p>
      <p><strong>Stress Summary:</strong> {report.stressSummary}</p>

      <h3>Recommendations (AYUSH Guidelines)</h3>
      <ul>
        {report.recommendations.map((rec, idx) => (
          <li key={idx}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}

export default ReportsPage;