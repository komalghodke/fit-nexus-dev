import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      // ✅ backend may send "id" instead of "userId"
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId || res.data.id);
      localStorage.setItem("email", res.data.email);
      
      window.location.replace("/dashboard");
    } catch (err) {
      alert("Login failed! Check credentials.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
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