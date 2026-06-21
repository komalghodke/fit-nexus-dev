import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/reports", {
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