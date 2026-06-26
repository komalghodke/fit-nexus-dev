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
import { Email, Lock } from "@mui/icons-material";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId || res.data.id);
      localStorage.setItem("email", res.data.email);
      
      window.location.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Login failed! Please check your credentials.");
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
            border: "1px solid rgba(255, 255, 255, 0.5)",
            overflow: "visible"
          }}
        >
          <CardContent sx={{ px: 4, py: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#6f4381",
                  letterSpacing: -0.5,
                  mb: 1
                }}
              >
                🌿 FitNexus
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back! Enter your credentials to log in.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#904caf" }} />
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
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#7c4caf" }} />
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
                    backgroundColor: "#602e7d",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(89, 46, 125, 0.4)",
                    "&:hover": {
                      backgroundColor: "#531b5e",
                      boxShadow: "0 6px 20px rgba(87, 46, 125, 0.6)",
                    }
                  }}
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: "#762e7d", fontWeight: "bold", cursor: "pointer" }}
                >
                  Register Here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginForm;