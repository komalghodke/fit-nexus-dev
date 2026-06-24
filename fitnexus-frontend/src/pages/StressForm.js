import React, { useState } from "react";
import axios from "axios";

function StressForm() {
  const [stress, setStress] = useState({ level: "", notes: "" });
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setStress({ ...stress, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/stress/${userId}`, stress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Stress logged successfully!");
      setStress({ level: "", notes: "" });
    } catch {
      alert("Failed to log stress");
    }
  };

  return (
    <div>
      <h2>🧘 Stress Log</h2>
      <form onSubmit={handleSubmit}>
        <input name="level" value={stress.level} onChange={handleChange} placeholder="Stress Level (1-10)" />
        <input name="notes" value={stress.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Save Stress</button>
      </form>
    </div>
  );
}
export default StressForm;
