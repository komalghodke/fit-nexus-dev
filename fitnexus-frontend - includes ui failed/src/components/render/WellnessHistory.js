import React from 'react';

const WellnessHistory = ({ history }) => (
  <div className="wellness-history">
    <h3>📈 Your Wellness Journey</h3>
    {history.length === 0 ? (
      <p>No history yet. Start journaling to begin your journey.</p>
    ) : (
      <ul>
        {history.map((entry, index) => (
          <li key={index} style={{ marginBottom: '16px' }}>
            <strong>{new Date(entry.timestamp).toLocaleString()}</strong><br />
            🧘 Mood: {entry.mood || "—"} | 😴 Sleep: {entry.sleepHours}h | ⚡ Energy: {entry.energy || "—"}<br />
            🪞 Journal Tone: {entry.journalTone || "—"}<br />
            ✨ Affirmation: {entry.affirmation || "—"}<br />
            🧘 Practice: {entry.practice || "—"}<br />
            📿 Mantra: {entry.mantra || "—"}<br />
            📊 Score: {entry.score}/10
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default WellnessHistory;