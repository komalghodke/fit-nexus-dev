import React from "react";

function ProfilePage() {
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <div>
      <h1>👤 Profile</h1>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>User ID:</strong> {userId}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
export default ProfilePage;
