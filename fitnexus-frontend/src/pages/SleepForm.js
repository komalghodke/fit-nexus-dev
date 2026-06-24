import React, { useState } from "react";
import axios from "axios";

function SleepForm() {
  const [sleep, setSleep] = useState({ hours: "", quality: "" });
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setSleep({ ...sleep, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/sleep/${userId}`, sleep, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Sleep logged successfully!");
      setSleep({ hours: "", quality: "" });
    } catch {
      alert("Failed to log sleep");
    }
  };

  return (
    <div>
      <h2>😴 Sleep Log</h2>
      <form onSubmit={handleSubmit}>
        <input name="hours" value={sleep.hours} onChange={handleChange} placeholder="Hours Slept" />
        <input name="quality" value={sleep.quality} onChange={handleChange} placeholder="Quality (Good/Bad)" />
        <button type="submit">Save Sleep</button>
      </form>
    </div>
  );
}
export default SleepForm;
