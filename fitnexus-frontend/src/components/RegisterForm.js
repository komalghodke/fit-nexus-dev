import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/apiConfig";
import { Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Container,
  Alert,
  InputAdornment,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";

function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "USER", adminCode: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "USER";

  if (token) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER") {
      return <Navigate to="/staff" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.replace("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Registration failed! Email might already be taken.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <Box
      sx={{
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5", // neutral background
        py: 4
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)", // soft shadow
            backgroundColor: "#fff" // clean white card
          }}
        >
          <CardContent sx={{ px: 4, py: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#333", // dark gray title
                  letterSpacing: -0.5,
                  mb: 1
                }}
              >
                🪷 Register
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Create a FitNexus account to begin your wellness journey.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleRegister}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Username"
                  name="username"
                  type="text"
                  fullWidth
                  required
                  value={form.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#602e7d" }} /> {/* purple accent */}
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    }
                  }}
                />

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={form.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#602e7d" }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    }
                  }}
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  required
                  value={form.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#602e7d" }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    }
                  }}
                />

                <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                  <InputLabel id="role-label">Register As</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={form.role}
                    label="Register As"
                    onChange={handleChange}
                  >
                    <MenuItem value="USER">🧘 Member</MenuItem>
                    <MenuItem value="YOGA_INSTRUCTOR">🪷 Yoga Instructor</MenuItem>
                    <MenuItem value="GYM_TRAINER">🏋️ Gym Trainer</MenuItem>
                    <MenuItem value="ADMIN">⚙️ Admin</MenuItem>
                  </Select>
                </FormControl>

                {form.role === "ADMIN" && (
                   <TextField
                     fullWidth
                     label="Admin Secret Code"
                     name="adminCode"
                     type="password"
                     value={form.adminCode || ""}
                     onChange={handleChange}
                     required
                     InputProps={{
                       startAdornment: (
                         <InputAdornment position="start">
                           <Lock color="action" />
                         </InputAdornment>
                       ),
                     }}
                     sx={{
                       "& .MuiOutlinedInput-root": {
                         borderRadius: 3,
                       }
                     }}
                   />
                 )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    background: "linear-gradient(90deg, #054474, rgb(114, 76, 175))",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(20, 54, 77, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #0f2535, rgb(90, 60, 140))", // darker hover gradient
                      boxShadow: "0 6px 20px rgba(20, 54, 77, 0.6)",
                    }
                  }}
                >
                  {loading ? "Registering..." : "Create Account"}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#555" }}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ color: "#602e7d", fontWeight: "bold", cursor: "pointer" }}
                >
                  Login Here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default RegisterForm;