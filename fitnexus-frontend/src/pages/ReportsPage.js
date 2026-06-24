import React, { useEffect, useState } from "react";
import { fetchReport } from "../api/reportsApi";
import { generateWellnessResponse } from "../logic/WellnessEngine";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

  const data = [
    { name: "Workout", value: report.workoutScore || 2 },
    { name: "Nutrition", value: report.nutritionScore || 2 },
    { name: "Sleep", value: report.sleepScore || 3 },
    { name: "Stress", value: report.stressScore || 3 }
  ];
  const COLORS = ["#4caf50", "#ff9800", "#2196f3", "#f44336"];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 Wellness Insights</h1>
      <p><strong>Name:</strong> {report.name}</p>
      <p><strong>Email:</strong> {report.email}</p>
      <p><strong>Score:</strong> {report.score}/10</p>
      <blockquote>{report.affirmation}</blockquote>
      <p>📿 Mantra: {report.mantra}</p>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          outerRadius={100}
          label
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
export default ReportsPage;
