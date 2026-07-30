import React, { useEffect, useState } from "react";
import axios from "axios";

function NutritionList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    axios
      .get("${API_URL}/nutrition", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeals(res.data))
      .catch(() => alert("Failed to load meals"));
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h3>Nutrition History</h3>
      {meals.length === 0 ? (
        <p>No meals logged yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Meal</th>
              <th>Calories</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((m) => (
              <tr key={m.id}>
                <td>{m.meal}</td>
                <td>{m.calories}</td>
                <td>{m.notes}</td>
                <td>{new Date(m.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NutritionList;