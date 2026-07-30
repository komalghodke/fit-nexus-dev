import React, { useEffect, useState } from "react";
import axios from "axios";

function StressList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    axios
      .get("${API_URL}/stress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecords(res.data))
      .catch(() => alert("Failed to load stress records"));
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h3>Stress History</h3>
      {records.length === 0 ? (
        <p>No stress records yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Level</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.level}</td>
                <td>{r.notes}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StressList;