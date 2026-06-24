import React, { useState } from 'react';
import WellnessForm from '../form/WellnessForm';
import WellnessSummary from '../render/WellnessSummary';
import { generateWellnessResponse } from '../engine/WellnessLogic';
import '../../styles/WellnessTracker.css';
import '../../styles/WellnessSummary.css';
import WellnessDisplay from '../render/WellnessDisplay';

const WellnessTracker = () => {
  const [showSummary, setShowSummary] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showInitialGuidance, setShowInitialGuidance] = useState(true);

  const [inputs, setInputs] = useState({
    mood: '',
    energy: '',
    sleep: '',
    age: '',
    height: '',
    weight: '',
    sleepHours: '',
    painArea: '',
    journal: '',
    stressLevel: '',
    waterIntake: '',
    heartRate: '',
    digestiveIssues: '',
    sleepQuality: 5,
    experienceLevel: '',
    activityType: '',
    activityDays: '',
    activityDuration: '',
    hasDisease: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [guidance, setGuidance] = useState([]);
  const [batch, setBatch] = useState('');
  const [summary, setSummary] = useState('');
  const [wellnessResponse, setWellnessResponse] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const response = generateWellnessResponse(inputs);
    setWellnessResponse(response);
    setSummary(response.summary);
    setSuggestions(response.tips);
    setGuidance(response.guidance);
    setBatch(response.batch);
    setShowSummary(true);
    setShowFullSummary(false);
    setShowInitialGuidance(true);
  };

  const bmi =
    inputs.height && inputs.weight
      ? (inputs.weight / ((inputs.height / 100) ** 2)).toFixed(1)
      : null;

  console.log("showFullSummary:", showFullSummary);
  console.log("showInitialGuidance:", showInitialGuidance);

  return (
    <div className="wellness-container">
      <h2 className="wellness-title">🌿 Wellness Companion</h2>

      <WellnessForm
        inputs={inputs}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {/* Initial Guidance */}
      {showSummary && showInitialGuidance && (
        <>
         <WellnessDisplay
          suggestions={suggestions}
          guidance={guidance}
          batch={batch}
          journal={inputs.journal}
          bmi={bmi}
          energy={inputs.energy}
          sleepHours={inputs.sleepHours}
          painArea={inputs.painArea}
          stressLevel={inputs.stressLevel}
          experienceLevel={inputs.experienceLevel}
          activityType={inputs.activityType}
          activityDays={inputs.activityDays}
          activityDuration={inputs.activityDuration}
          hasDisease={inputs.hasDisease}
          summary={summary}
          affirmation={wellnessResponse.affirmation}
          mantra={wellnessResponse.mantra}
          practice={wellnessResponse.practice}
          chakra={wellnessResponse.chakra}
          journalReflection={wellnessResponse.journalReflection}
          journalSuggestion={wellnessResponse.journalSuggestion}
          inputs={inputs}
          email={inputs.email}
        />

          <div className="text-center mt-6 space-x-4">
          <div className="wellness-form text-center mt-6 space-x-4">
            <button onClick={() => {
              setShowFullSummary(true);
              setShowInitialGuidance(false);
            }}>
              📋 Show Full Summary
            </button>
          </div>
          </div>
        </>
      )}

      {showFullSummary && (
        <>
          <div id="printable-summary" className="printable-summary bg-white p-10 rounded-xl shadow-xl">
            <div className="report-header text-center mb-8">
            <img
              src="https://placehold.co/120x120/E8E8E8/4B0082?text=YD+Logo"
              alt="Yog-Dhara Logo"
              className="mx-auto mb-4 w-24 h-24 rounded-full"
            />
            <h1 className="text-4xl font-bold text-green-700 mb-2">'Fit-Nexus' – Wellness Report</h1>
            <h3 className="text-xl font-semibold text-purple-700">सर्वे सन्तु निरामयाः — May All Be Well</h3>
            <div className="text-center mt-6">
              <span className="report-highlight">Hello {inputs.fullName} Ji, here are your personalized insights</span>
            </div>
            <div className="section-divider"></div> 
          </div>

            <div className="section-block mb-8">
              <h2 className="text-center text-3xl font-semibold text-purple-700 mb-6">🧾 Questionnaire Summary</h2>
              <WellnessSummary inputs={inputs} />
            </div>

            <div className="section-block mb-8">
              <h2 className="text-center text-3xl font-semibold text-purple-700 mb-6">🌿 Wellness Companion Insights</h2>
              <WellnessDisplay
                suggestions={suggestions}
                guidance={guidance}
                batch={batch}
                journal={inputs.journal}
                bmi={bmi}
                energy={inputs.energy}
                sleepHours={inputs.sleepHours}
                painArea={inputs.painArea}
                stressLevel={inputs.stressLevel}
                experienceLevel={inputs.experienceLevel}
                activityType={inputs.activityType}
                activityDays={inputs.activityDays}
                activityDuration={inputs.activityDuration}
                hasDisease={inputs.hasDisease}
                summary={summary}
                affirmation={wellnessResponse.affirmation}
                mantra={wellnessResponse.mantra}
                practice={wellnessResponse.practice}
                chakra={wellnessResponse.chakra}
                journalReflection={wellnessResponse.journalReflection}
                journalSuggestion={wellnessResponse.journalSuggestion}
                inputs={inputs}
                email={inputs.email}
              />
            </div>

            <div className="report-footer text-center mt-8">
              <p className="text-sm text-gray-500">© 2025 Fit-Nexus | All rights reserved. @komalghodke</p>
              <p className="text-sm text-gray-500">This wellness report is generated exclusively by <strong>Fit-Nexus </strong>.</p>
              <img src="https://placehold.co/100x100/E8E8E8/4B0082?text=QR+Code" alt="Scan to visit Yog-Dhara" className="mx-auto mt-3 w-20 h-20" />
            </div>
          </div>

          <div className="text-center mt-6 space-x-4">
          <div className="wellness-form text-center mt-6 space-x-4">
        <button onClick={() => setTimeout(() => window.print(), 500)}>
          🖨️ Print My Summary
        </button>

        <button onClick={() => window.location.reload()}>
          🔄 Refresh
        </button>

        <button onClick={() => {
          setShowFullSummary(false);
          setShowInitialGuidance(true);
        }}>
          ❌ Cancel
        </button>
      </div>

        </div>
        </>
      )}
    </div>
  );
};

export default WellnessTracker;