import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // keep your CSS inside src/App.css
import { useTranslation } from "react-i18next";

// Option arrays
const moodOptions = ["Calm","Stressed","Anxious","Joyful","Sad","Irritable","Grateful","Lonely","Angry","Hopeful"];
const stressLevelOptions = ["None","Mild","Moderate","Severe"];
const sleepOptions = ["Restful","Interrupted","Insomnia","LightSleep","Oversleeping","DreamDisturbed"]

const energyOptions = [
  "Low","Balanced","High","MentallyFatigued","PhysicallyTired","Hyperactive","Sluggish"
];
const digestiveIssuesOptions = [
  "None","Bloating","Constipation","Acidity"
];
const painAreaOptions = [
  "None","Back","Neck","LowerBack","Shoulders","Knees","Ankles","Wrist","Headache","ChestTightness",
  "Jaw","Eyes","Fatigue","Abdomen","Pelvis","Sciatica","Elbows","Feet"
];
const experienceOptions = [
  "Beginner","Active","Yoga Practitioner"
];
const activityOptions = [
  "None","Walking","Running","Gym","Yoga","Dance","Sports","Other"
];

const WellnessForm = () => {
  const { t, i18n } = useTranslation();
  const [inputs, setInputs] = useState({});
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/wellness/${userId}`, inputs, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Wellness assessment submitted!");
      // Optionally redirect:
      // navigate("/reports");
    } catch (err) {
      alert("❌ Failed to submit wellness data");
    }
  };

  return (
    <>
      {/* 🌐 Language Selector */}
      <div style={{ textAlign: "right", marginBottom: "16px" }}>
        <label>{t("language")}: </label>
        <select onChange={(e) => i18n.changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="wellness-form">
        {/* 👤 Basic Info */}
        <div className="form-section-card">
          <h4 className="form-section">👤 {t("Basic Information")}</h4>
          <div className="input-row">
            <div className="input-group">
              <label>{t("Full Name")} *</label>
              <input type="text" name="fullName" value={inputs.fullName || ""} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>{t("Email")} *</label>
              <input type="email" name="email" value={inputs.email || ""} onChange={handleChange} required />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>{t("Mobile No")} *</label>
              <input type="tel" name="mobileNumber" pattern="[0-9]{10}" maxLength="10" value={inputs.mobileNumber || ""} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>{t("Gender")} *</label>
              <select name="gender" value={inputs.gender || ""} onChange={handleChange} required>
                <option value="">{t("select")}</option>
                <option value="Male">{t("Male")}</option>
                <option value="Female">{t("Female")}</option>
                <option value="Other">{t("Other")}</option>
              </select>
            </div>
            <div className="input-group">
              <label>{t("City")} *</label>
              <input type="text" name="city" value={inputs.city || ""} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* 📊 Physical Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">📊 {t("Physical Wellness")}</h4>
          <div className="input-row">
            <div className="input-group">
              <label>{t("Age")}</label>
              <input type="number" name="age" value={inputs.age || ""} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>{t("Height")}</label>
              <input type="number" name="height" value={inputs.height || ""} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>{t("Weight")}</label>
              <input type="number" name="weight" value={inputs.weight || ""} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>{t("Water Intake (liters)")}</label>
              <input type="number" name="waterIntake" value={inputs.waterIntake || ""} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* 🧠 Emotional Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t("Emotional Wellness")}</h4>
          <div className="input-group">
            <label>{t("Mood")}</label>
            <select name="mood" value={inputs.mood || ""} onChange={handleChange}>
              <option value="">{t("select")}</option>
              {moodOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>{t("Stress Level")}</label>
            <select name="stressLevel" value={inputs.stressLevel || ""} onChange={handleChange}>
              <option value="">{t("select")}</option>
              {stressLevelOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>{t("Sleep Quality")}</label>
            <select name="sleep" value={inputs.sleep || ""} onChange={handleChange}>
              <option value="">{t("select")}</option>
              {sleepOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* 🧠 Spiritual Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t("Spiritual Wellness")}</h4>
          <div className="input-group">
            <label>{t("Inner Peace")}</label>
            <select name="innerPeace" value={inputs.innerPeace || ""} onChange={handleChange}>
              <option value="">{t("select")}</option>
              <option value="true">{t("Yes")}</option>
              <option value="false">{t("No")}</option>
              <option value="sometimes">{t("Sometimes")}</option>
            </select>
          </div>
        </div>

        {/* 🧠 Social Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t("Social Wellness")}</h4>
          <div className="input-group">
            <label>{t("Social Support")}</label>
            <select name="socialSupport" value={inputs.socialSupport || ""} onChange={handleChange}>
              <option value="">{t("select")}</option>
              <option value="true">{t("Yes")}</option>
              <option value="false">{t("No")}</option>
              <option value="sometimes">{t("Sometimes")}</option>
            </select>
          </div>
        </div>

        {/* 🧠 Occupational Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t("Occupational Wellness")}</h4>
          <div className="input-group">
            <label>{t("Work Satisfaction")}</label>
            <input
              type="range"
              name="workSatisfaction"
              min="1"
              max="10"
              value={inputs.workSatisfaction || 5}
              onChange={handleChange}
            />
            <span>{inputs.workSatisfaction}</span>
          </div>
        </div>

        {/* 🧠 Environmental Wellness */}
        <div className="form-section-card">
          <h4 className="form-section">🧠 {t("Environmental Wellness")}</h4>
          <div className="input-group">
            <label>{t("Hours with Nature")}</label>
            <input
              type="number"
              name="withNature"
              min="0"
              max="24"
              value={inputs.withNature || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 🩺 Medical History */}
        <div className="form-section-card">
          <h4 className="form-section">🩺 {t("Medical History")}</h4>
          <div className="input-group"></div>

          <div className="input-group">
            <label>{t("hasDisease")}</label>
            <select
              name="hasDisease"
              value={inputs.hasDisease || ""}
              onChange={handleChange}
            >
              <option value="">{t("select")}</option>
              <option value="true">{t("Yes")}</option>
              <option value="false">{t("No")}</option>
            </select>
          </div>
        </div>

        {/* ✅ Submit Button */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button type="submit" className="submit-btn">
            {t("submit")}
          </button>
        </div>
      </form>
    </>
  );
};

export default WellnessForm;