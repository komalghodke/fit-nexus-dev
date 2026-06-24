import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/WellnessSummary.css';

const WellnessSummary = ({ inputs }) => {
  const { t } = useTranslation();

  return (
    <div className="summary-section">
      {/* 👤 Personal Information */}
      <div className="summary-block">
        <h4>👤 Personal Information</h4>
        <ul>
          <li><strong>Full Name:</strong> {inputs.fullName}</li>
          <li><strong>Email:</strong> {inputs.email}</li>
          <li><strong>Mobile No:</strong> {inputs.mobileNumber}</li>
          <li><strong>Gender:</strong> {inputs.gender}</li>
          <li><strong>City:</strong> {inputs.city}</li>
        </ul>
      </div>

      {/* 📊 Physical Wellness */}
      <h4>📊 Physical Wellness</h4>
      <ul>
        <li><strong>Age:</strong> {inputs.age || "Not shared"}</li>
        <li><strong>Height:</strong> {inputs.height || "Not shared"} cm</li>
        <li><strong>Weight:</strong> {inputs.weight || "Not shared"} kg</li>
        <li><strong>Water Intake:</strong> {inputs.waterIntake || "Not shared"} L/day</li>
        <li><strong>Digestive Issues:</strong> {t(`digestiveIssuesOptions.${inputs.digestiveIssues || "Not shared"}`)}</li>
        <li><strong>Body Pain Area:</strong> {t(`painAreaOptions.${inputs.painArea || "Not shared"}`)}</li>
        <li><strong>Resting Heart Rate:</strong> {inputs.heartRate || "Not shared"} BPM</li>
        <li><strong>Sleep Duration:</strong> {inputs.sleepHours || "Not shared"} hrs/night</li>
        <li><strong>Sleep Quality:</strong> {inputs.sleepQuality || "Not shared"}/10</li>
      </ul>

      {/* 🧠 Emotional Wellness */}
      <h4>🧠 Emotional Wellness</h4>
      <ul>
        <li><strong>Mood:</strong> {t(`moodOptions.${inputs.mood}`)}</li>
        <li><strong>Energy Level:</strong> {t(`energyOptions.${inputs.energy}`)}</li>
        <li><strong>Sleep Pattern:</strong> {t(`sleepOptions.${inputs.sleep}`)}</li>
      </ul>

      {/* 🧘 Physical Activity */}
      <h4>🧘 Physical Activity</h4>
      <ul>
        <li><strong>Yoga Experience:</strong> {t(`experienceOptions.${inputs.experienceLevel}`)}</li>
        <li><strong>Activity Type:</strong> {t(`activityOptions.${inputs.activityType}`)}</li>
        <li><strong>Days per Week:</strong> {inputs.activityDays}</li>
        <li><strong>Minutes per Session:</strong> {inputs.activityDuration}</li>
      </ul>

      {/* 🧘 Spiritual Wellness */}
      <h4>🧘 Spiritual Wellness</h4>
      <ul>
        <li><strong>Inner Peace / Higher Purpose:</strong> {inputs.innerPeace === 'true' ? t('Yes') : t('No')}</li>
      </ul>

      {/* 🤝 Social Wellness */}
      <h4>🤝 Social Wellness</h4>
      <ul>
        <li><strong>Support from Friends/Family:</strong> {inputs.socialSupport === 'true' ? t('Yes') : t('No')}</li>
      </ul>

      {/* 💼 Occupational Wellness */}
      <h4>💼 Occupational Wellness</h4>
      <ul>
        <li><strong>Work-Life Satisfaction:</strong> {inputs.workSatisfaction}/10</li>
      </ul>

      {/* 🌳 Environmental Wellness */}
      <h4>🌳 Environmental Wellness</h4>
      <ul>
        <li><strong>Time in Nature:</strong> {inputs.withNature} hrs/week</li>
      </ul>

      {/* 🩺 Medical History */}
      <h4>🩺 Medical History</h4>
      <ul>
        <li><strong>Medical Condition:</strong> {inputs.hasDisease === 'true' ? t('Yes') : t('No')}</li>
      </ul>

      {/* 📝 Journal Entry */}
      {inputs.journal && (
        <>
          <h4>📝 Journal Entry</h4>
          <p>{inputs.journal}</p>
        </>
      )}
    </div>
  );
};

export default WellnessSummary;