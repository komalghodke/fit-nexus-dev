import React, { useState } from "react";
import axios from "axios";

function NutritionForm() {
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/nutrition", {
        meal,
        calories,
        protein,
        carbs,
        fat,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Meal logged!");
      setMeal("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
    } catch (err) {
      alert("Failed to log meal");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h3>Log Nutrition</h3>
      <input
        type="text"
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
        placeholder="Meal Name"
      />
      <input
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        placeholder="Calories"
      />
      <input
        type="number"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
        placeholder="Protein (g)"
      />
      <input
        type="number"
        value={carbs}
        onChange={(e) => setCarbs(e.target.value)}
        placeholder="Carbs (g)"
      />
      <input
        type="number"
        value={fat}
        onChange={(e) => setFat(e.target.value)}
        placeholder="Fat (g)"
      />
      <button type="submit">Save Meal</button>
    </form>
  );
}

export default NutritionForm;
