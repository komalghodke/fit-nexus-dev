import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  CircularProgress
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  Bedtime,
  Psychology,
  Assignment,
  AccountCircle,
  TrendingUp
} from "@mui/icons-material";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!token || !email) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8080/api/users/profile/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Session expired or load failed", err);
        localStorage.clear();
        navigate("/login");
      });
  }, [token, email, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  const sections = [
    {
      title: "Workout Log",
      description: "Log your daily physical workouts, yoga sessions, or routines.",
      icon: <FitnessCenter sx={{ fontSize: "2.5rem", color: "#2e7d32" }} />,
      route: "/workout",
      color: "#e8f5e9"
    },
    {
      title: "Nutrition Log",
      description: "Keep track of meals, water intake, calories, and macro-nutrients.",
      icon: <Restaurant sx={{ fontSize: "2.5rem", color: "#e65100" }} />,
      route: "/nutrition",
      color: "#fff3e0"
    },
    {
      title: "Sleep Log",
      description: "Track your sleeping hours, quality of rest, and bedtime routines.",
      icon: <Bedtime sx={{ fontSize: "2.5rem", color: "#1565c0" }} />,
      route: "/sleep",
      color: "#e3f2fd"
    },
    {
      title: "Stress Log",
      description: "Log your stress levels, emotional moods, and meditation minutes.",
      icon: <Psychology sx={{ fontSize: "2.5rem", color: "#c2185b" }} />,
      route: "/stress",
      color: "#fce4ec"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Welcome Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 3,
          mb: 6,
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #752e7d 0%, #5e1b4b 100%)",
          color: "white",
          boxShadow: "0 6px 20px rgba(46,125,50,0.25)"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(255,255,255,0.2)", color: "white" }}>
            <AccountCircle sx={{ fontSize: "2.8rem" }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              Namaste, {profile?.username || "Friend"}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              Welcome back to your holistic wellness tracker
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          component={Link}
          to="/profile"
          sx={{
            backgroundColor: "white",
            color: "#752e7d",
            fontWeight: "bold",
            borderRadius: 2.5,
            px: 3,
            py: 1,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f1f1f1"
            }
          }}
        >
          View Profile
        </Button>
      </Box>

      {/* Main Call to Action: Assessment */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          borderLeft: "8px solid #7d2e7d",
          mb: 6,
          background: "#fafafa"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Assignment sx={{ color: "#7d2e59" }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#521b5e" }}>
                  🌿 Complete Wellness Assessment
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Generate your holistic health scores across physical, emotional, social, occupational, spiritual, and
                environmental aspects, and receive personalized AYUSH-based recommendations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
              <Button
                variant="contained"
                component={Link}
                to="/wellness"
                size="large"
                sx={{
                  backgroundColor: "#5d2e7d",
                  fontWeight: "bold",
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(118, 46, 125, 0.4)",
                  "&:hover": {
                    backgroundColor: "#5e1b4b"
                  }
                }}
              >
                Start Assessment
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold", px: 2 }}>
          QUICK TRACKING LOGS
        </Typography>
      </Divider>

      {/* Grid of Logging Cards */}
      <Grid container spacing={4}>
        {sections.map((sec, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Box
                sx={{
                  p: 3,
                  backgroundColor: sec.color,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {sec.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1, px: 3, py: 3, display: "flex", flexDirection: "column", justifyContnet: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {sec.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {sec.description}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to={sec.route}
                  sx={{
                    mt: "auto",
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "#692e7d",
                    borderColor: "#7d2e71",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.04)",
                      borderColor: "#5e1b50"
                    }
                  }}
                >
                  Open Logger
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View Reports Quick Nav */}
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Button
          variant="text"
          component={Link}
          to="/reports"
          startIcon={<TrendingUp />}
          sx={{
            fontWeight: "bold",
            color: "#905ccf",
            fontSize: "1.1rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(46, 125, 50, 0.05)"
            }
          }}
        >
          View Wellness Insights & Recommendations →
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
