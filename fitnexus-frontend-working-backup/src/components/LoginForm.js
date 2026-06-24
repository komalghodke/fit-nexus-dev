import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");       // ✅ declare email state
  const [password, setPassword] = useState(""); // ✅ declare password state

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,     // ✅ send email, not username
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email); // ✅ store email for profile fetch
      window.location.replace("/dashboard");
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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