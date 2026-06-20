import React, { useState } from "react";
import axios from "axios";

function StressForm() {
  const [level, setLevel] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/stress", {
        level,
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Stress record added!");
      setLevel("");
      setNotes("");
    } catch (err) {
      alert("Failed to add stress record");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h3>Log Stress</h3>
      <input
        type="number"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        placeholder="Stress Level (1-10)"
      />
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      <button type="submit">Save Stress</button>
    </form>
  );
}

export default StressForm;
