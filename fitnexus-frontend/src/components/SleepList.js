import React, { useEffect, useState } from "react";
import axios from "axios";

function SleepList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    axios
      .get("${API_URL}/sleep", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecords(res.data))
      .catch(() => alert("Failed to load sleep records"));
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h3>Sleep History</h3>
      {records.length === 0 ? (
        <p>No sleep records yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Hours</th>
              <th>Quality</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.hours}</td>
                <td>{r.quality}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SleepList;
