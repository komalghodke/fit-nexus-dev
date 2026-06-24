import React, { useState } from "react";
import axios from "axios";

function WellnessForm() {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    sleepHours: "",
    sleepQuality: "",
    mood: "",
    energyLevel: "",
    waterIntake: "",
    digestiveIssues: "",
    painArea: "",
    yogaExperience: "",
    daysPerWeek: "",
    minutesPerSession: "",
    journalEntry: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.post("http://localhost:8080/api/wellness-input", formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => alert("Wellness input saved!"))
    .catch(() => alert("Error saving input"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Wellness Questionnaire</h2>
      {Object.keys(formData).map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input name={field} value={formData[field]} onChange={handleChange} />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default WellnessForm;
