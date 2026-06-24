import React, { useState } from "react";
import axios from "axios";

function WorkoutForm() {
  const [workout, setWorkout] = useState({ type: "", duration: "", notes: "" });
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setWorkout({ ...workout, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/workout/${userId}`, workout, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Workout logged successfully!");
      setWorkout({ type: "", duration: "", notes: "" });
    } catch (err) {
      alert("Failed to log workout");
    }
  };

  return (
    <div>
      <h2>🏋️ Workout Log</h2>
      <form onSubmit={handleSubmit}>
        <input name="type" value={workout.type} onChange={handleChange} placeholder="Workout Type" />
        <input name="duration" value={workout.duration} onChange={handleChange} placeholder="Duration (mins)" />
        <input name="notes" value={workout.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Save Workout</button>
      </form>
    </div>
  );
}
export default WorkoutForm;
