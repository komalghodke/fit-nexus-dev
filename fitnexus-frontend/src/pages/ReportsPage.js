import React, { useEffect, useState } from "react";
import { fetchReport } from "../api/reportsApi";
import { generateWellnessResponse } from "../logic/WellnessEngine";

function ReportsPage() {
  const [report, setReport] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await fetchReport(userId);
        const enriched = generateWellnessResponse(data);
        setReport({ ...data, ...enriched });
      } catch (err) {
        console.error("Error fetching report", err);
      }
    }
    loadReport();
  }, [userId]);

  if (!report) return <p>Loading...</p>;

  return (
    <div>
      <h1>🌿 FitNexus Wellness Insights</h1>
      <p><strong>Name:</strong> {report.name}</p>
      <p><strong>Email:</strong> {report.email}</p>
      <p><strong>Score:</strong> {report.score}/10</p>
      <blockquote>{report.affirmation}</blockquote>
      <p>📿 Mantra: {report.mantra}</p>
    </div>
  );
}
export default ReportsPage;
