import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      window.location.replace("/dashboard"); // ✅ clean redirect
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <button onClick={() => (window.location.href = "/register")}>
          Register Here
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
