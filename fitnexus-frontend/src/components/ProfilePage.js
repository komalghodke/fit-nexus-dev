import React, { useEffect, useState } from "react";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [newName, setNewName] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  fetch("http://localhost:8080/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    })
    .then(data => {
      setProfile(data);
      setNewName(data.name);
    })
    .catch(err => alert(err.message));
}, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setProfile(data);
      alert("Profile updated!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <input value={newName} onChange={e => setNewName(e.target.value)} />
      <button onClick={handleUpdate}>Update Name</button>
    </div>
  );
}

export default ProfilePage;