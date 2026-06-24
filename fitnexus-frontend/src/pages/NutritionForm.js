import React, { useState } from "react";
import axios from "axios";

function NutritionForm() {
  const [meal, setMeal] = useState({ food: "", calories: "", notes: "" });
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setMeal({ ...meal, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/nutrition/${userId}`, meal, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Meal logged successfully!");
      setMeal({ food: "", calories: "", notes: "" });
    } catch (err) {
      alert("Failed to log meal");
    }
  };

  return (
    <div>
      <h2>🍎 Nutrition Log</h2>
      <form onSubmit={handleSubmit}>
        <input name="food" value={meal.food} onChange={handleChange} placeholder="Food Item" />
        <input name="calories" value={meal.calories} onChange={handleChange} placeholder="Calories" />
        <input name="notes" value={meal.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Save Meal</button>
      </form>
    </div>
  );
}
export default NutritionForm;
