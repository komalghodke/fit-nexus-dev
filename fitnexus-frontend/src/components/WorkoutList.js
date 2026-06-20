import React, { useEffect, useState } from "react";
import axios from "axios";

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:8080/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWorkouts(res.data))
      .catch(() => alert("Failed to load workouts"));
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h3>Workout History</h3>
      {workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Duration (min)</th>
              <th>Calories</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <td>{w.exercise}</td>
                <td>{w.duration}</td>
                <td>{w.calories}</td>
                <td>{new Date(w.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkoutList;