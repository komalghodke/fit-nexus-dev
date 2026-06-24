import React from 'react';
import '../../styles/App.css';
import { useTranslation } from 'react-i18next';

const moodOptions = [ "Calm", "Stressed", "Anxious", "Joyful", "Sad", "Irritable", "Grateful", "Lonely", "Angry", "Hopeful" ];
const energyOptions = [ "Low", "Balanced", "High", "MentallyFatigued", "PhysicallyTired", "Hyperactive", "Sluggish" ];
const sleepOptions = [ "Restful", "Interrupted", "Insomnia", "LightSleep", "Oversleeping", "DreamDisturbed", "EarlyWaking" ];
const stressLevelOptions = [ "None", "Mild", "Moderate", "Severe" ];
const digestiveIssuesOptions = [ "None", "Bloating", "Constipation", "Acidity" ];
const painAreaOptions = [ "None", "Back", "Neck", "LowerBack", "Shoulders", "Knees", "Ankles", "Wrist", "Headache", "ChestTightness", "Jaw", "Eyes", "Fatigue", "Abdomen", "Pelvis", "Sciatica", "Elbows", "Feet" ];
const experienceOptions = [ "Beginner", "Active", "Yoga Practitioner" ];
const activityOptions = [ "None", "Walking", "Running", "Gym", "Yoga", "Dance", "Sports", "Other" ];

const WellnessForm = ({ inputs, handleChange, handleSubmit }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <label>{t('language')}: </label>
        <select onChange={(e) => i18n.changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="wellness-form">
          {/* 👤 Basic Info */}
          <div className="form-section-card">
            <h4 className="form-section">👤 {t('Basic Information')}</h4>
            
            {/* First row: Full Name, Email, Mobile */}
            <div className="input-row">
              <div className="input-group">
                <label>{t('Full Name')} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={inputs.fullName || ''}
                  onChange={handleChange}
                  required
                  minLength={2}
                  onInvalid={(e) => e.target.setCustomValidity('Please enter your full name')}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
              <div className="input-group">
                <label>{t('email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email || ''}
                  onChange={handleChange}
                  required
                  onInvalid={(e) => e.target.setCustomValidity('Please enter a valid email address')}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
            </div>
            {/* Second row: City */}
            <div className="input-row">
              <div className="input-group">
                <label>{t('Mobile No')} *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={inputs.mobileNumber || ''}
                  onChange={handleChange}
                  required
                  onInvalid={(e) => e.target.setCustomValidity('Enter a 10-digit mobile number')}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
              <div className="input-group">
                <label>{t('Gender')} *</label>
                <select
                  name="gender"
                  value={inputs.gender || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('select')}</option>
                  <option value="Male">{t('Male')}</option>
                  <option value="Female">{t('Female')}</option>
                  <option value="Other">{t('Other')}</option>
                  <option value="PreferNotToSay">{t('Prefer not to say')}</option>
                </select>
              </div>
              <div className="input-group">
                <label>{t('City')} *</label>
                <input
                  type="text"
                  name="city"
                  value={inputs.city || ''}
                  onChange={handleChange}
                  required
                  minLength={2}
                />
              </div>
            </div>
            </div>

        {/* 📊 Physical Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">📊 {t('Physical Wellness')}</h4>
          <div className="input-row">
            <div className="input-group">
              <label>{t('age')}</label>
              <input type="number" name="age" min="5" max="120" value={inputs.age || ''} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>{t('height')}</label>
              <input type="number" name="height" min="90" max="250" value={inputs.height || ''} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>{t('weight')}</label>
              <input type="number" name="weight" min="30" max="250" value={inputs.weight || ''} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>{t('waterIntake')}</label>
              <input type="number" name="waterIntake" value={inputs.waterIntake || ''} onChange={handleChange} />
            </div>
          </div>

        <div className="input-row">
          <div className="input-group">
            <label>{t('digestiveIssues')}</label>
            <select name="digestiveIssues" value={inputs.digestiveIssues || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {digestiveIssuesOptions.map(d => <option key={d} value={d}>{t(`digestiveIssuesOptions.${d}`)}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>{t('painArea')}</label>
            <select name="painArea" value={inputs.painArea || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {painAreaOptions.map(p => <option key={p} value={p}>{t(`painAreaOptions.${p}`)}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>{t('heartRate')}</label>
            <input type="number" name="heartRate" value={inputs.heartRate || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>{t('sleepHours')}</label>
            <input type="number" name="sleepHours" min="0" max="24" value={inputs.sleepHours || ''} onChange={handleChange} />
          </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>{t('sleepQuality')}</label>
              <input type="range" name="sleepQuality" min="1" max="10" value={inputs.sleepQuality || 5} onChange={handleChange} />
              <span>{inputs.sleepQuality}</span>
            </div>
        </div>
          
          {/* 🧘 Physical Activity */}
        <div className="form-section-card">
          <h4 className="form-section">🧘 {t('Physical Activity')}</h4>
          <div className="input-group">
            <label>{t('energy')}</label>
            <select name="energy" value={inputs.energy || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {energyOptions.map(e => <option key={e} value={e}>{t(`energyOptions.${e}`)}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>{t('activityType')}</label>
            <select name="activityType" value={inputs.activityType || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {activityOptions.map(opt => (
                <option key={opt} value={opt}>{t(`activityOptions.${opt}`)}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t('experienceLevel')}</label>
            <select name="experienceLevel" value={inputs.experienceLevel || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {experienceOptions.map(opt => (
                <option key={opt} value={opt}>{t(`experienceOptions.${opt}`)}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t('activityDays')}</label>
            <input type="number" name="activityDays" min="0" max="7" value={inputs.activityDays || ''} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>{t('activityDuration')}</label>
            <input type="number" name="activityDuration" min="0" max="180" value={inputs.activityDuration || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="input-group">
            <label>{t('journal')}</label>
            <textarea
              name="journal"
              placeholder={t('journalPlaceholder')}
              value={inputs.journal || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 🧠 Emotional Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t('Emotional Wellness')}</h4>
          <div className="input-group">
            <label>{t('mood')}</label>
            <select name="mood" value={inputs.mood || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {moodOptions.map(m => <option key={m} value={m}>{t(`moodOptions.${m}`)}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>{t('stressLevel')}</label>
            <select name="stressLevel" value={inputs.stressLevel || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {stressLevelOptions.map(s => <option key={s} value={s}>{t(`stressLevelOptions.${s}`)}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>{t('sleep')}</label>
            <select name="sleep" value={inputs.sleep || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              {sleepOptions.map(s => <option key={s} value={s}>{t(`sleepOptions.${s}`)}</option>)}
            </select>
          </div>
        </div>

        {/* 🧠 Spiritual Wellness */}
        {/* Offer meditation or journaling prompts based on responses */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t('Spiritual Wellness')}</h4>
          <div className="input-group">
            <label>{t('Do you feel connected to a higher purpose or inner peace?')}</label>
            <select name="innerPeace" value={inputs.innerPeace || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              <option value="true">{t('Yes')}</option>
              <option value="false">{t('No')}</option>
              <option value="false">{t('Sometimes')}</option>
            </select>
          </div>
        </div>

  
        {/* 🧠 Social Wellness */}
        {/* Suggest group yoga, community engagement, or gratitude practices */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t('Social Wellness')}</h4>
          <div className="input-group">
            <label>{t('Do you feel supported by friends/family?')}</label>
            <select name="socialSupport" value={inputs.socialSupport || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              <option value="true">{t('Yes')}</option>
              <option value="false">{t('No')}</option>
              <option value="false">{t('Sometimes')}</option>
            </select>
          </div>
        </div>

        {/* 🧠 Occupational Wellness */}
        {/* Recommend stress-relief yoga or time-blocking techniques */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t('Occupational Wellness')}</h4>
          <div className="input-group">
            <label>{t('How satisfied are you with your work-life balance?')}</label>
            <input type="range" name="workSatisfaction" min="1" max="10" value={inputs.workSatisfaction || 5} onChange={handleChange} />
            <span>{inputs.workSatisfaction}</span>
          </div>
        </div>

        {/* 🧠 Environmental Wellness */}
        {/* Recommend stress-relief yoga or time-blocking techniques */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t('Environmental Wellness')}</h4>
          <div className="input-group">
             <label>{t('How much time do you spend in nature?')}</label>
            <input type="number" name="withNature" min="0" max="24" value={inputs.withNature || ''} onChange={handleChange} />
          </div>
        </div>

        {/* 🩺 Medical History */}
        <div className="form-section-card">
          <h4 className="form-section">🩺 {t('Medical History')}</h4>
          <div className="input-group">
            <label>{t('hasDisease')}</label>
            <select name="hasDisease" value={inputs.hasDisease || ''} onChange={handleChange}>
              <option value="">{t('select')}</option>
              <option value="true">{t('Yes')}</option>
              <option value="false">{t('No')}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button type="submit">{t('submit')}</button>
        </div>
      </form>
    </>
  );
};

export default WellnessForm;