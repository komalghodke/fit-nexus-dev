import React, { useEffect, useState } from "react";
import axios from "axios";

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    axios
      .get("${API_URL}/workouts", {
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
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Intensity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <td>{w.type}</td>
                <td>{w.duration}</td>
                <td>{w.intensity}</td>
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