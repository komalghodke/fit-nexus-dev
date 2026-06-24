import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const toneColor = {
  Positive: '#4CAF50',
  Neutral: '#FFC107',
  Negative: '#F44336'
};

const WellnessProgressChart = ({ history }) => {
  if (!history || history.length === 0) return <p>No wellness data available yet.</p>;

  const recentHistory = history.slice(-20); // Show only last 20 entries

  const data = {
    labels: recentHistory.map(entry => new Date(entry.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Wellness Score',
        data: recentHistory.map(entry => entry.score),
        backgroundColor: recentHistory.map(entry => toneColor[entry.journalTone] || '#999'),
        borderColor: '#4B0082',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const entry = history[context.dataIndex];
            return [
              `Score: ${entry.score}/10`,
              `Tone: ${entry.journalTone}`,
              `Affirmation: ${entry.affirmation}`,
              `Mantra: ${entry.mantra}`,
              `Practice: ${entry.practice}`
            ];
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 10,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return `${value}/10`;
          }
        },
        title: {
          display: true,
          text: 'Wellness Score'
        }
      }
    }
  };

return (
  <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <h3 style={{ marginBottom: '16px' }}>📈 Wellness Progress Chart</h3>
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  </div>
);
};

export default WellnessProgressChart;