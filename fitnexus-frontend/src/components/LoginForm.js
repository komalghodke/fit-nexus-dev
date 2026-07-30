import React, { useState, useEffect } from "react";
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
  Chip
} from "@mui/material";
import {
  Email,
  Lock,
  SelfImprovement,
  FitnessCenter,
  Person,
  SupervisorAccount
} from "@mui/icons-material";

// Portal definitions
const portals = [
  {
    key: "USER",
    label: "Member",
    emoji: "🧘",
    icon: <Person />,
    color: "#2e7d32",
    gradient: "linear-gradient(135deg, #2e7d32, #43a047)",
    bg: "#f1f8e9",
    tagline: "Track your personal wellness journey"
  },
  {
    key: "YOGA_INSTRUCTOR",
    label: "Yoga Instructor",
    emoji: "🪷",
    icon: <SelfImprovement />,
    color: "#602e7d",
    gradient: "linear-gradient(135deg, #602e7d, rgb(114, 76, 175))",
    bg: "#f3e5f5",
    tagline: "Manage and guide your students"
  },
  {
    key: "GYM_TRAINER",
    label: "Gym Trainer",
    emoji: "🏋️",
    icon: <FitnessCenter />,
    color: "#054474",
    gradient: "linear-gradient(135deg, #054474, #0277bd)",
    bg: "#e3f2fd",
    tagline: "Monitor member fitness and progress"
  },
  {
    key: "ADMIN",
    label: "Admin",
    emoji: "⚙️",
    icon: <SupervisorAccount />,
    color: "#c62828",
    gradient: "linear-gradient(135deg, #c62828, #e53935)",
    bg: "#ffebee",
    tagline: "Full system administration and oversight"
  }
];

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState(portals[0]);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("sessionExpired") === "true") {
      setSessionExpiredMsg("⏱️ Your session has expired. Please log in again to continue.");
      sessionStorage.removeItem("sessionExpired");
    }
  }, []);

  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role") || "USER";

  if (token) {
    if (currentRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (currentRole === "YOGA_INSTRUCTOR" || currentRole === "GYM_TRAINER") {
      return <Navigate to="/staff" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Debug logging
      console.log('Login response:', res.data);

      const role = (res.data.role || "USER").trim().toUpperCase();

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId || res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", role);

      // Auto-route based on user's actual registered role
      if (role === "ADMIN") {
        window.location.replace("/admin");
      } else if (role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER") {
        window.location.replace("/staff");
      } else {
        window.location.replace("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
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
        background: "linear-gradient(135deg, #f5f5f5 0%, #ede7f6 100%)",
        py: 4
      }}
    >
      <Container maxWidth="sm">
        {/* App Branding */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 900, color: "#2c2c2c", letterSpacing: -1 }}
          >
            🪷 FitNexus
          </Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>
            Your holistic wellness platform
          </Typography>
        </Box>

        {/* Session Expired Banner */}
        {sessionExpiredMsg && (
          <Alert
            severity="warning"
            onClose={() => setSessionExpiredMsg("")}
            sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
          >
            {sessionExpiredMsg}
          </Alert>
        )}

        <Card
          sx={{
            borderRadius: 5,
            boxShadow: "0 12px 40px rgba(96,46,125,0.12)",
            overflow: "visible"
          }}
        >
          {/* Portal Selector Tabs */}
          <Box
            sx={{
              display: "flex",
              borderRadius: "20px 20px 0 0",
              overflow: "hidden",
              borderBottom: "2px solid #f0f0f0"
            }}
          >
            {portals.map((portal) => {
              const isActive = selectedPortal.key === portal.key;
              return (
                <Box
                  key={portal.key}
                  onClick={() => { setSelectedPortal(portal); setError(""); }}
                  sx={{
                    flex: 1,
                    py: 2,
                    px: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    background: isActive ? portal.gradient : "#fafafa",
                    borderBottom: isActive ? `3px solid ${portal.color}` : "3px solid transparent",
                    "&:hover": {
                      background: isActive ? portal.gradient : portal.bg
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.4rem",
                      lineHeight: 1
                    }}
                  >
                    {portal.emoji}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: isActive ? "#fff" : "#555",
                      fontSize: "0.72rem",
                      textAlign: "center",
                      lineHeight: 1.2
                    }}
                  >
                    {portal.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <CardContent sx={{ px: 4, pt: 4, pb: 5 }}>
            {/* Active Portal Info */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                background: selectedPortal.bg,
                border: `1px solid ${selectedPortal.color}22`,
                display: "flex",
                alignItems: "center",
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: selectedPortal.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0
                }}
              >
                {selectedPortal.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: selectedPortal.color }}>
                  {selectedPortal.label} Portal
                </Typography>
                <Typography variant="caption" sx={{ color: "#666" }}>
                  {selectedPortal.tagline}
                </Typography>
              </Box>
              <Chip
                label="Secure Login"
                size="small"
                sx={{
                  ml: "auto",
                  bgcolor: `${selectedPortal.color}15`,
                  color: selectedPortal.color,
                  fontWeight: 600,
                  fontSize: "0.65rem"
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                        <Email sx={{ color: selectedPortal.color }} />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&.Mui-focused fieldset": {
                        borderColor: selectedPortal.color
                      }
                    },
                    "& label.Mui-focused": {
                      color: selectedPortal.color
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
                        <Lock sx={{ color: selectedPortal.color }} />
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&.Mui-focused fieldset": {
                        borderColor: selectedPortal.color
                      }
                    },
                    "& label.Mui-focused": {
                      color: selectedPortal.color
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
                    py: 1.6,
                    borderRadius: 3,
                    background: selectedPortal.gradient,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: `0 6px 20px ${selectedPortal.color}44`,
                    mt: 0.5,
                    "&:hover": {
                      background: selectedPortal.gradient,
                      opacity: 0.92,
                      boxShadow: `0 8px 28px ${selectedPortal.color}55`
                    }
                  }}
                >
                  {loading ? "Logging in..." : `Login as ${selectedPortal.label}`}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3.5, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: selectedPortal.color, fontWeight: "bold", cursor: "pointer" }}
                >
                  Register Here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Portal hint footer */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#aaa", display: "block", mb: 1 }}>
            Select your portal above then enter your credentials · Secured with JWT
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link href="/about" sx={{ color: "#602e7d", fontWeight: "bold", fontSize: "0.8rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              About FitNexus
            </Link>
            <Typography variant="caption" sx={{ color: "#ccc" }}>|</Typography>
            <Link href="/privacy" sx={{ color: "#602e7d", fontWeight: "bold", fontSize: "0.8rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginForm;