import React, { useState } from "react";
import axios from "axios";

function NutritionForm() {
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/nutrition", {
        meal,
        calories,
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Meal logged!");
      setMeal("");
      setCalories("");
      setNotes("");
    } catch (err) {
      alert("Failed to log meal");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h3>Log Meal</h3>
      <input
        type="text"
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
        placeholder="Meal (Breakfast, Lunch, Dinner)"
      />
      <input
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        placeholder="Calories"
      />
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (e.g., vegetarian, balanced)"
      />
      <button type="submit">Save Meal</button>
    </form>
  );
}

export default NutritionForm;