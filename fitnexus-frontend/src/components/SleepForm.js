import React, { useState } from "react";
import axios from "axios";

function SleepForm() {
  const [hours, setHours] = useState("");
  const [quality, setQuality] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/sleep", {
        hours,
        quality,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Sleep record added!");
      setHours("");
      setQuality("");
    } catch (err) {
      alert("Failed to add sleep record");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h3>Log Sleep</h3>
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="Hours Slept"
      />
      <input
        type="text"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        placeholder="Sleep Quality (e.g., Good, Poor)"
      />
      <button type="submit">Save Sleep</button>
    </form>
  );
}

export default SleepForm;