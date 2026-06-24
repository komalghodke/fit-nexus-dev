import React from "react";

function ReportsPage({ report }) {
  return (
    <div className="reports-container">
      <h1 className="title">🌿 Wellness Companion Insights</h1>

      <section className="card">
        <h2>👤 Personal Information</h2>
        <p>Full Name: {report.name}</p>
        <p>Email: {report.email}</p>
        <p>Age: {report.age}</p>
        <p>Gender: {report.gender}</p>
        <p>City: {report.city}</p>
      </section>

      <section className="card">
        <h2>📊 Physical Wellness</h2>
        <p>Height: {report.height} cm</p>
        <p>Weight: {report.weight} kg</p>
        <p>Water Intake: {report.waterIntake} L/day</p>
        <p>Digestive Issues: {report.digestiveIssues}</p>
        <p>Sleep Duration: {report.sleepHours} hrs/night</p>
        <p>Sleep Quality: {report.sleepQuality}/10</p>
      </section>

      <section className="card">
        <h2>🧠 Emotional Wellness</h2>
        <p>Mood: {report.mood}</p>
        <p>Energy Level: {report.energyLevel}</p>
      </section>

      <section className="card affirmation">
        <h2>✨ Special Affirmation</h2>
        <blockquote>{report.affirmation}</blockquote>
        <p>📿 Mantra: {report.mantra}</p>
      </section>

      <section className="card score">
        <h2>📊 Wellness Score</h2>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${report.score * 10}%` }}></div>
        </div>
        <p>{report.score}/10</p>
      </section>
    </div>
  );
}

export default ReportsPage;