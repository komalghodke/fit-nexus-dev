import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Button, Avatar, Divider, CircularProgress, Chip
} from "@mui/material";
import {
  FitnessCenter, Restaurant, Bedtime, Psychology,
  Assignment, AccountCircle, TrendingUp, SelfImprovement,
  Bolt, WaterDrop, MonitorHeart, CheckCircle
} from "@mui/icons-material";
import { API_URL } from "../api/apiConfig";

// Removed hardcoded API constant; using API_URL

function StatCard({ icon, label, value, unit, color, bg }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        background: bg,
        border: `1px solid ${color}22`,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.1)" }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Box
            sx={{
              width: 42, height: 42, borderRadius: "12px",
              background: `${color}18`,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: "1.3rem" } })}
          </Box>
          <Typography variant="caption" sx={{ color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color, lineHeight: 1 }}>
          {value}
          <Typography component="span" variant="body2" sx={{ color: "#888", ml: 0.5, fontWeight: 500 }}>
            {unit}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats]     = useState({ workouts: 0, sleepAvg: "—", stressLast: "—", mealCount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token  = localStorage.getItem("token");
  const email  = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !email) { navigate("/login"); return; }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${API_URL}/users/profile/${email}`, { headers }),
      axios.get(`${API_URL}/workout/${userId}`,    { headers }).catch(() => ({ data: [] })),
      axios.get(`${API_URL}/sleep/${userId}`,      { headers }).catch(() => ({ data: [] })),
      axios.get(`${API_URL}/stress/${userId}`,     { headers }).catch(() => ({ data: [] })),
      axios.get(`${API_URL}/nutrition/${userId}`,  { headers }).catch(() => ({ data: [] }))
    ])
      .then(([prof, wkt, slp, str, nut]) => {
        setProfile(prof.data);
        const sleeps = slp.data || [];
        const avgSleep = sleeps.length
          ? (sleeps.reduce((s, x) => s + (x.hours || 0), 0) / sleeps.length).toFixed(1)
          : "—";
        const stresses = str.data || [];
        const lastStress = stresses.length ? stresses[stresses.length - 1].level || "—" : "—";
        setStats({
          workouts:   (wkt.data || []).length,
          sleepAvg:   avgSleep,
          stressLast: lastStress,
          mealCount:  (nut.data || []).length
        });
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.error("Failed to load dashboard data:", err);
        }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#602e7d" }} />
      </Box>
    );
  }

  const sections = [
    { title: "Workout Log",   desc: "Log yoga sessions, gym workouts, and physical activity.",  icon: <FitnessCenter />, route: "/workout",   color: "#2e7d32", bg: "#f1f8e9" },
    { title: "Nutrition Log", desc: "Track meals, macro-nutrients, calories, and water intake.", icon: <Restaurant />,   route: "/nutrition", color: "#e65100", bg: "#fff3e0" },
    { title: "Sleep Log",     desc: "Record sleeping hours, bedtime, wake time, and quality.",   icon: <Bedtime />,      route: "/sleep",     color: "#1565c0", bg: "#e3f2fd" },
    { title: "Stress Log",    desc: "Track stress levels, mood, and meditation minutes.",        icon: <Psychology />,   route: "/stress",    color: "#c2185b", bg: "#fce4ec" }
  ];

  const quickStats = [
    { icon: <FitnessCenter />, label: "Workouts",     value: stats.workouts, unit: "logged",   color: "#2e7d32", bg: "#f1f8e9" },
    { icon: <Bedtime />,       label: "Avg Sleep",    value: stats.sleepAvg, unit: "hrs",      color: "#1565c0", bg: "#e3f2fd" },
    { icon: <Psychology />,    label: "Last Stress",  value: stats.stressLast, unit: "",       color: "#c2185b", bg: "#fce4ec" },
    { icon: <Restaurant />,    label: "Meals Logged", value: stats.mealCount, unit: "entries", color: "#e65100", bg: "#fff3e0" }
  ];

  return (
    <Box sx={{ minHeight: "90vh", background: "#f8f9fc" }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>

        {/* ── Welcome Banner ─────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex", alignItems: "center", flexWrap: "wrap",
            justifyContent: "space-between", gap: 3, mb: 5, p: 4,
            borderRadius: 5,
            background: "linear-gradient(135deg, #0d2c4e 0%, #255f9a 50%, #602e7d 100%)",
            color: "white",
            boxShadow: "0 8px 30px rgba(96,46,125,0.3)"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.3)" }}>
              <AccountCircle sx={{ fontSize: "2.8rem" }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                Namaste, {profile?.username || "Friend"} 🙏
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mt: 0.5 }}>
                Welcome back to your holistic wellness journey
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
                <Chip icon={<SelfImprovement sx={{ fontSize: "0.85rem !important", color: "#b39ddb !important" }} />}
                  label="6 Wellness Dimensions" size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: "0.7rem" }} />
                <Chip icon={<CheckCircle sx={{ fontSize: "0.85rem !important", color: "#a5d6a7 !important" }} />}
                  label="YCB Aligned" size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: "0.7rem" }} />
              </Box>
            </Box>
          </Box>
          <Button
            component={Link} to="/profile" variant="contained"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)", color: "#fff",
              fontWeight: "bold", borderRadius: 2.5, px: 3, py: 1,
              textTransform: "none", border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" }
            }}
          >
            View Profile
          </Button>
        </Box>

        {/* ── Quick Stats ─────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {quickStats.map((s, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* ── Assessment CTA ──────────────────────────────────────── */}
        <Card
          sx={{
            borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            borderLeft: "6px solid #602e7d", mb: 5, background: "#fdf8ff"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Assignment sx={{ color: "#602e7d", fontSize: "1.8rem" }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#602e7d" }}>
                    🌿 Holistic Wellness Assessment
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Complete your personalised assessment across all 6 wellness dimensions and receive
                  AYUSH-aligned yoga recommendations, wellness score, chakra insights, and mantra guidance.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Button
                  variant="contained" component={Link} to="/wellness" size="large"
                  sx={{
                    fontWeight: "bold", borderRadius: 3, px: 4, py: 1.5, textTransform: "none",
                    background: "linear-gradient(135deg, #602e7d, #054474)",
                    boxShadow: "0 4px 16px rgba(96,46,125,0.35)",
                    "&:hover": { opacity: 0.9 }
                  }}
                >
                  Start Assessment →
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, px: 2, letterSpacing: 1 }}>
            DAILY TRACKING LOGS
          </Typography>
        </Divider>

        {/* ── Logger Cards ────────────────────────────────────────── */}
        <Grid container spacing={3}>
          {sections.map((sec, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  height: "100%", display: "flex", flexDirection: "column",
                  borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 28px rgba(0,0,0,0.09)" }
                }}
              >
                <Box sx={{ p: 3, background: sec.bg, borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {React.cloneElement(sec.icon, { sx: { fontSize: "2.8rem", color: sec.color } })}
                </Box>
                <CardContent sx={{ flexGrow: 1, px: 3, py: 2.5, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8 }}>{sec.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flexGrow: 1 }}>
                    {sec.desc}
                  </Typography>
                  <Button
                    variant="outlined" fullWidth component={Link} to={sec.route}
                    sx={{
                      mt: "auto", borderRadius: 2.5, textTransform: "none", fontWeight: "bold",
                      color: sec.color, borderColor: `${sec.color}88`,
                      "&:hover": { bgcolor: `${sec.color}08`, borderColor: sec.color }
                    }}
                  >
                    Log Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── View Reports Link ───────────────────────────────────── */}
        <Box sx={{ textAlign: "center", mt: 7 }}>
          <Button
            variant="text" component={Link} to="/reports" startIcon={<TrendingUp />}
            sx={{
              fontWeight: "bold", color: "#602e7d", fontSize: "1.05rem", textTransform: "none",
              "&:hover": { bgcolor: "rgba(96,46,125,0.06)" }
            }}
          >
            View Wellness Insights &amp; Recommendations →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;
