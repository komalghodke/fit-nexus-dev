import React, { useState } from "react";
import axios from "axios";

function WorkoutForm() {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/workouts", {
        exercise,
        duration,
        calories,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Workout added!");
      setExercise("");
      setDuration("");
      setCalories("");
    } catch (err) {
      alert("Failed to add workout");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h3>Add Workout</h3>
      <input
        type="text"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise Type"
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
      />
      <input
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        placeholder="Calories Burned"
      />
      <button type="submit">Save Workout</button>
    </form>
  );
}

export default WorkoutForm;