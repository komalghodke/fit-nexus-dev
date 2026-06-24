import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      alert("Registration successful!");
      window.location.replace("/login");
    } catch {
      alert("Registration failed!");
    }
  };

  return (
    <div>
      <h3>📝 Register</h3>
      <form onSubmit={handleRegister}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <button onClick={() => (window.location.href = "/login")}>Login Here</button>
      </p>
    </div>
  );
}
export default RegisterForm;
