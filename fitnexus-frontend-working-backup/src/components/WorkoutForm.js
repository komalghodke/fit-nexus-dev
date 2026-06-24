import React, { useState } from "react";
import axios from "axios";

function WorkoutForm() {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/workouts", {
        type,
        duration,
        intensity,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Workout logged!");
      setType("");
      setDuration("");
      setIntensity("");
    } catch (err) {
      alert("Failed to log workout");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h3>Log Workout</h3>
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Workout Type (Yoga, Cardio, Strength)"
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
      />
      <input
        type="text"
        value={intensity}
        onChange={(e) => setIntensity(e.target.value)}
        placeholder="Intensity (Low, Medium, High)"
      />
      <button type="submit">Save Workout</button>
    </form>
  );
}

export default WorkoutForm;