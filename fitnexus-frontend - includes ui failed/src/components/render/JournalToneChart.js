import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const JournalToneChart = ({ wellnessHistory = [] }) => {
  const counts = {};

  wellnessHistory.forEach(entry => {
    const tone = entry.journalTone || 'Unknown';
    const mood = entry.mood || 'Unknown';
    const energy = entry.energy || 'Unknown';

    counts[`🪞 Tone • ${tone}`] = (counts[`🪞 Tone • ${tone}`] || 0) + 1;
    counts[`🧠 Mood • ${mood}`] = (counts[`🧠 Mood • ${mood}`] || 0) + 1;
    counts[`⚡ Energy • ${energy}`] = (counts[`⚡ Energy • ${energy}`] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const colorMap = {
    '🪞 Tone • Positive': '#4CAF50',
    '🪞 Tone • Neutral': '#FFC107',
    '🪞 Tone • Negative': '#F44336',
    '🧠 Mood • Joyful': '#8BC34A',
    '🧠 Mood • Sad': '#2196F3',
    '🧠 Mood • Anxious': '#9C27B0',
    '⚡ Energy • Balanced': '#00BCD4',
    '⚡ Energy • Hyperactive': '#FF9800',
    '⚡ Energy • Fatigued': '#795548',
    '⚡ Energy • MentallyFatigued': '#607D8B',
    'Unknown': '#9E9E9E'
  };

  const pieChartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: labels.map(label => colorMap[label] || '#999')
    }]
  };

  const pieChartOptions = {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value} entries`;
          }
        }
      }
    }
  };

  // 🔍 Insight Summary
  const getDominantState = () => {
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [label, value] = sorted[0] || ['Unknown', 0];
    const meaningMap = {
      '🪞 Tone • Positive': 'You’re expressing emotions openly and reflectively.',
      '🪞 Tone • Neutral': 'You’re observing without judgment—consider deeper emotional journaling.',
      '🪞 Tone • Negative': 'You may be processing heavy emotions—gentle practices can help.',
      '🧠 Mood • Joyful': 'Your mood is uplifted—keep nurturing what brings joy.',
      '🧠 Mood • Sad': 'You’re in a reflective or low mood—self-compassion is key.',
      '🧠 Mood • Anxious': 'You may feel restless—try grounding breathwork.',
      '⚡ Energy • Balanced': 'Your energy is stable—great foundation for healing.',
      '⚡ Energy • Hyperactive': 'You’re overstimulated—consider calming practices.',
      '⚡ Energy • Fatigued': 'You’re low on vitality—rest and restoration are needed.',
      '⚡ Energy • MentallyFatigued': 'Mental fatigue is present—try digital detox or meditation.'
    };
    return {
      label,
      value,
      meaning: meaningMap[label] || 'Reflect on this emotional pattern.'
    };
  };

  const insight = getDominantState();

  return (
    <div style={{ marginTop: '32px' }}>
      <h4>🧘 Emotional Snapshot</h4>
      <p style={{ fontSize: '14px', marginBottom: '12px' }}>
        This chart shows how your journal entries reflect emotional tone, mood, and energy. Each slice represents how often a state appeared.
      </p>
      <Pie data={pieChartData} options={pieChartOptions} />

      <div style={{ marginTop: '24px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
        <strong>🧠 Insight:</strong> Your most frequent emotional state is <strong>{insight.label}</strong> ({insight.value} entries).<br />
        <span>{insight.meaning}</span>
      </div>

      <details style={{ marginTop: '16px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📘 Emotional State Legend</summary>
        <ul style={{ fontSize: '14px', marginTop: '8px' }}>
          <li>🪞 <strong>Tone</strong>: Positive, Neutral, Negative — reflects emotional expression</li>
          <li>🧠 <strong>Mood</strong>: Joyful, Sad, Anxious — reflects emotional atmosphere</li>
          <li>⚡ <strong>Energy</strong>: Balanced, Hyperactive, Fatigued — reflects vitality and nervous system</li>
        </ul>
      </details>
    </div>
  );
};

export default JournalToneChart;