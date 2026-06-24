import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

const chakraColorMap = {
  Root: '#8B0000',
  Sacral: '#FF4500',
  Solar: '#FFD700',
  Heart: '#32CD32',
  Throat: '#1E90FF',
  ThirdEye: '#4B0082',
  Crown: '#9400D3'
};

const chakraDescriptions = {
  Root: "🔴 Root – Grounding, safety, survival. Activated when feeling anxious or physically tired.",
  Sacral: "🟠 Sacral – Creativity, sensuality, emotional flow. Activated by hyperactivity or emotional surges.",
  Solar: "🟡 Solar Plexus – Confidence, control, personal power. Activated when angry or frustrated.",
  Heart: "🟢 Heart – Compassion, love, grief. Activated when sad or emotionally vulnerable.",
  Throat: "🔵 Throat – Expression, truth, communication. Activated when journal tone is negative or suppressed.",
  ThirdEye: "🟣 Third Eye – Intuition, clarity, insight. Activated by positive journal tone or deep reflection.",
  Crown: "🟪 Crown – Bliss, transcendence, spiritual connection. Activated when joyful or deeply peaceful."
};

const mapChakra = (entry) => {
  const { mood, energy, journalTone } = entry;

  if (mood === "Sad" && journalTone === "Negative") return "Heart";
  if (mood === "Angry" && energy === "High") return "Solar";
  if (energy === "PhysicallyTired" && journalTone === "Neutral") return "Root";
  if (energy === "MentallyFatigued" && journalTone === "Negative") return "Throat";
  if (journalTone === "Positive" && mood === "Joyful") return "Crown";
  if (journalTone === "Positive" && energy === "Balanced") return "ThirdEye";
  if (energy === "Hyperactive") return "Sacral";

  return "Heart"; // fallback
};

const countFrequency = (array, key) => {
  return array.reduce((acc, entry) => {
    const value = entry[key];
    if (value) acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

const ChakraJourneyChart = ({ wellnessHistory = [] }) => {
  const [showLegend, setShowLegend] = useState(false);

  if (!Array.isArray(wellnessHistory) || wellnessHistory.length === 0) {
    return <p>🌱 No chakra data available. Please add journal entries to begin your journey.</p>;
  }

  // Chakra summary logic
  const chakraSummary = wellnessHistory.reduce((acc, entry) => {
    const chakra = mapChakra(entry);
    acc[chakra] = (acc[chakra] || 0) + 1;
    return acc;
  }, {});
  const chakraEntries = Object.entries(chakraSummary);
  const mostActivated = chakraEntries.length > 0 ? chakraEntries.sort((a, b) => b[1] - a[1])[0] : null;

  // Chakra chart data
  const labels = wellnessHistory.map(entry =>
    entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : "Unknown"
  );
  const chakraData = wellnessHistory.map(entry => mapChakra(entry));
  const chakraColors = chakraData.map(chakra => chakraColorMap[chakra]);

  const chakraChartData = {
    labels,
    datasets: [{
      label: 'Chakra Activation',
      data: chakraData,
      backgroundColor: chakraColors,
      borderColor: chakraColors,
      borderWidth: 2,
      pointRadius: 6
    }]
  };

  const chakraChartOptions = {
    scales: {
      y: {
        type: 'category',
        labels: Object.keys(chakraColorMap),
        title: { display: true, text: 'Chakra' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const recentHistory = wellnessHistory.slice(-20); // Show only last 20 entries

  const scoreData = recentHistory.map(entry => {
    const scoreString = String(entry.score || '');
    const scoreMatch = scoreString.match(/\d+/);
    return scoreMatch ? parseInt(scoreMatch[0], 10) : null;
  });

  const scoreLabels = recentHistory.map(entry =>
    entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : "Unknown"
  );

  const getScoreColor = (score) => {
    if (score >= 8) return '#4CAF50'; // Green
    if (score >= 5) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  const getScoreEmoji = (score) => {
    if (score >= 8) return '🌟';
    if (score >= 5) return '🙂';
    return '⚠️';
  };

  const averageScore = scoreData.reduce((a, b) => a + b, 0) / scoreData.length;

  const scoreChartData = {
    labels: scoreLabels,
    datasets: [
      {
        label: 'Wellness Score',
        data: scoreData,
        borderColor: scoreData.map(getScoreColor),
        backgroundColor: scoreData.map(getScoreColor),
        tension: 0.3,
        pointRadius: 5
      },
      {
        label: 'Average Score',
        data: Array(scoreData.length).fill(averageScore),
        borderColor: '#888',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const scoreChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Score: ${context.raw}/10`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
          callback: value => `${value}/10`
        },
        title: {
          display: true,
          text: 'Wellness Score'
        }
      },
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 30
        },
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Affirmation & Practice Insights
  const affirmationFreq = countFrequency(wellnessHistory, 'affirmation');
  const practiceFreq = countFrequency(wellnessHistory, 'practice');
  const mantraFreq = countFrequency(wellnessHistory, 'mantra');

  const topAffirmation = Object.entries(affirmationFreq).sort((a, b) => b[1] - a[1])[0];
  const topPractice = Object.entries(practiceFreq).sort((a, b) => b[1] - a[1])[0];
  const topMantra = Object.entries(mantraFreq).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ marginTop: '24px' }}>
      <h3>🧘 Chakra Journey Tracker</h3>
      <Line data={chakraChartData} options={chakraChartOptions} />

      <div style={{ marginTop: '32px' }}>
        <h4>🧘 Chakra Insight Summary</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Chakra</th>
              <th>Activations</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {chakraEntries.map(([chakra, count]) => {
              let balance = count >= 4 ? 'High' : count >= 2 ? 'Moderate' : 'Low';
              return (
                <tr key={chakra}>
                  <td style={{ color: chakraColorMap[chakra], fontWeight: 'bold' }}>{chakra}</td>
                  <td>{count}</td>
                  <td>{balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {mostActivated && (
          <p style={{ marginBottom: '16px' }}>
            🌟 Your most activated chakra is <strong style={{ color: chakraColorMap[mostActivated[0]] }}>{mostActivated[0]}</strong>, 
            reflecting a deep journey through {chakraDescriptions[mostActivated[0]].split('–')[1].trim().toLowerCase()}.
          </p>
        )}
      </div>

      <div style={{ marginTop: '48px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h4 style={{ marginBottom: '16px' }}>📈 Wellness Score Trend</h4>
        <div style={{ width: '100%', height: '400px' }}>
          <Line data={scoreChartData} options={scoreChartOptions} />
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h4>📿 Affirmation & Practice Insights</h4>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {topAffirmation && (
            <li><strong>✨ Affirmation:</strong> {topAffirmation[0]} <span style={{ color: '#888' }}>({topAffirmation[1]} times)</span></li>
          )}
          {topPractice && (
            <li><strong>🧘 Practice:</strong> {topPractice[0]} <span style={{ color: '#888' }}>({topPractice[1]} times)</span></li>
          )}
          {topMantra && (
            <li><strong>📿 Mantra:</strong> {topMantra[0]} <span style={{ color: '#888' }}>({topMantra[1]} times)</span></li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h4>🌈 Chakra Color Legend & Meaning</h4>
        <button
          onClick={() => setShowLegend(!showLegend)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          {showLegend ? 'Hide Legend' : 'Show Legend'}
        </button>

        {showLegend && (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {Object.entries(chakraDescriptions).map(([chakra, description]) => (
              <li key={chakra} style={{ marginBottom: '8px' }}>
                <span style={{ color: chakraColorMap[chakra], fontWeight: 'bold' }}>{description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChakraJourneyChart;