import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <Link to="/reports">Reports</Link> |{" "}
      {!token ? (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;
