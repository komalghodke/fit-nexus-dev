import React, { useState } from "react";
import axios from "axios";
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
  Link
} from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";

function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
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
        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        py: 4
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(76, 175, 80, 0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}
        >
          <CardContent sx={{ px: 4, py: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#2e7d32",
                  letterSpacing: -0.5,
                  mb: 1
                }}
              >
                📝 Register
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
                        <Person sx={{ color: "#4caf50" }} />
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
                        <Email sx={{ color: "#4caf50" }} />
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
                        <Lock sx={{ color: "#4caf50" }} />
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

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    backgroundColor: "#2e7d32",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(46, 125, 50, 0.4)",
                    "&:hover": {
                      backgroundColor: "#1b5e20",
                      boxShadow: "0 6px 20px rgba(46, 125, 50, 0.6)",
                    }
                  }}
                >
                  {loading ? "Registering..." : "Create Account"}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ color: "#2e7d32", fontWeight: "bold", cursor: "pointer" }}
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
