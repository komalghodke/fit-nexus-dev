import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Button, Avatar, Divider, CircularProgress, Chip,
  TextField, MenuItem
} from "@mui/material";
import {
  FitnessCenter, Restaurant, Bedtime, Psychology,
  Assignment, AccountCircle, TrendingUp, SelfImprovement,
  CheckCircle
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
  const [todayLogs, setTodayLogs] = useState({ workout: false, sleep: false, stress: false, nutrition: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Quick Log State
  const [quickWorkout, setQuickWorkout] = useState({ type: "Yoga", duration: 30, intensity: "Medium" });
  const [quickMeal, setQuickMeal]       = useState({ meal: "Snack", calories: 150 });
  const [quickSleep, setQuickSleep]     = useState({ hours: 8, quality: "Restful" });
  const [quickStress, setQuickStress]   = useState({ level: 5, notes: "" });

  // Notifications
  const [workoutMsg, setWorkoutMsg] = useState("");
  const [mealMsg, setMealMsg]       = useState("");
  const [sleepMsg, setSleepMsg]     = useState("");
  const [stressMsg, setStressMsg]   = useState("");

  const token  = localStorage.getItem("token");
  const email  = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const role   = localStorage.getItem("role");

  useEffect(() => {
    if (!token || !email) { navigate("/login"); return; }
    if (role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER") {
      navigate("/staff");
      return;
    }
    if (role === "ADMIN") {
      navigate("/admin");
      return;
    }
    loadStats(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = (showSpinner = false) => {
    if (showSpinner) setLoading(true);
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

        // Calculate today's logged checklist
        const todayStr = new Date().toDateString();
        setTodayLogs({
          workout: (wkt.data || []).some(x => x.createdAt && new Date(x.createdAt).toDateString() === todayStr),
          sleep: (slp.data || []).some(x => x.createdAt && new Date(x.createdAt).toDateString() === todayStr),
          stress: (str.data || []).some(x => x.createdAt && new Date(x.createdAt).toDateString() === todayStr),
          nutrition: (nut.data || []).some(x => x.createdAt && new Date(x.createdAt).toDateString() === todayStr)
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
  };

  const handleQuickWorkout = async (e) => {
    e.preventDefault();
    setWorkoutMsg("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/workout/${userId}`, {
        type: quickWorkout.type,
        duration: parseInt(quickWorkout.duration),
        intensity: quickWorkout.intensity
      }, { headers });
      setWorkoutMsg("Logged!");
      loadStats(false);
      setTimeout(() => setWorkoutMsg(""), 2000);
    } catch {
      setWorkoutMsg("Failed");
    }
  };

  const handleQuickMeal = async (e) => {
    e.preventDefault();
    setMealMsg("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/nutrition/${userId}`, {
        meal: quickMeal.meal,
        calories: parseInt(quickMeal.calories),
        notes: "Quick Logged from Dashboard"
      }, { headers });
      setMealMsg("Logged!");
      loadStats(false);
      setTimeout(() => setMealMsg(""), 2000);
    } catch {
      setMealMsg("Failed");
    }
  };

  const handleQuickSleep = async (e) => {
    e.preventDefault();
    setSleepMsg("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/sleep/${userId}`, {
        hours: parseInt(quickSleep.hours),
        quality: quickSleep.quality
      }, { headers });
      setSleepMsg("Logged!");
      loadStats(false);
      setTimeout(() => setSleepMsg(""), 2000);
    } catch {
      setSleepMsg("Failed");
    }
  };

  const handleQuickStress = async (e) => {
    e.preventDefault();
    setStressMsg("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/stress/${userId}`, {
        level: quickStress.level,
        notes: quickStress.notes || "Dashboard Quick Log"
      }, { headers });
      setStressMsg("Logged!");
      loadStats(false);
      setTimeout(() => setStressMsg(""), 2000);
    } catch {
      setStressMsg("Failed");
    }
  };

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
        {/* ── Interactive Workspace Row (Guidelines & Completeness Tracker) ── */}
        {(profile?.staffNotes || true) && (
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* Guidelines Card */}
            {profile?.staffNotes && (
              <Grid item xs={12} md={8}>
                <Card
                  sx={{
                    borderRadius: 4,
                    height: "100%",
                    background: "linear-gradient(135deg, #ffffff 0%, #fbf8ff 100%)",
                    border: "1px solid rgba(96, 46, 125, 0.15)",
                    boxShadow: "0 4px 20px rgba(96, 46, 125, 0.05)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Decorative corner glow */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(96, 46, 125, 0.15) 0%, transparent 70%)",
                      filter: "blur(10px)"
                    }}
                  />
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#602e7d", width: 44, height: 44 }}>
                        <SelfImprovement sx={{ color: "#fff" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#602e7d" }}>
                          📢 Professional Trainer & Instructor Guidelines
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Personalised prescription logged by your instructor
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: "#faf6ff",
                        borderRadius: 3,
                        borderLeft: "4px solid #602e7d",
                        minHeight: 80
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#3f2652", fontWeight: 500, lineHeight: 1.6 }}>
                        {profile.staffNotes}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Daily Tracker Checklist */}
            <Grid item xs={12} md={profile?.staffNotes ? 4 : 12}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  bgcolor: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #eee"
                }}
              >
                <CardContent sx={{ p: 3.5, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#2c2c2c", mb: 0.5 }}>
                    🎯 Today's Wellness Tracker
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                    Log all 4 dimensions daily to maintain balance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {/* Checklist items */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[
                      { key: "workout", label: "Logged Workout/Yoga", color: "#2e7d32" },
                      { key: "nutrition", label: "Logged Meals/Calories", color: "#e65100" },
                      { key: "sleep", label: "Logged Sleep Quality", color: "#1565c0" },
                      { key: "stress", label: "Logged Stress Level", color: "#c2185b" }
                    ].map((item) => {
                      const completed = todayLogs[item.key];
                      return (
                        <Box
                          key={item.key}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.2,
                            px: 2,
                            borderRadius: 2.5,
                            bgcolor: completed ? `${item.color}08` : "#f9f9f9",
                            border: completed ? `1px solid ${item.color}25` : "1px solid #f0f0f0"
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: completed ? item.color : "#555" }}>
                            {item.label}
                          </Typography>
                          <Chip
                            label={completed ? "Logged ✓" : "Pending"}
                            size="small"
                            color={completed ? "success" : "default"}
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.65rem",
                              height: 20,
                              bgcolor: completed ? `${item.color}20` : undefined,
                              color: completed ? item.color : undefined
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* ──⚡ FitNexus Quick-Log Desk ───────────────────────────── */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
          ⚡ FitNexus Quick-Log Desk
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Quick Workout Log */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, height: "100%", borderLeft: "5px solid #2e7d32", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>💪 Quick Workout</Typography>
                  {workoutMsg && <Chip label={workoutMsg} size="small" color={workoutMsg === "Logged!" ? "success" : "error"} />}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    select
                    label="Workout Type"
                    size="small"
                    value={quickWorkout.type}
                    onChange={e => setQuickWorkout({ ...quickWorkout, type: e.target.value })}
                  >
                    <MenuItem value="Yoga">Yoga</MenuItem>
                    <MenuItem value="Gym Weights">Gym Weights</MenuItem>
                    <MenuItem value="Walking">Walking</MenuItem>
                    <MenuItem value="Running">Running</MenuItem>
                    <MenuItem value="Meditation">Meditation</MenuItem>
                  </TextField>
                  <TextField
                    label="Duration (mins)"
                    type="number"
                    size="small"
                    value={quickWorkout.duration}
                    onChange={e => setQuickWorkout({ ...quickWorkout, duration: e.target.value })}
                  />
                  <Button variant="contained" color="success" onClick={handleQuickWorkout} sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}>
                    Log Workout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Calorie Log */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, height: "100%", borderLeft: "5px solid #e65100", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>🥗 Quick Meal</Typography>
                  {mealMsg && <Chip label={mealMsg} size="small" color={mealMsg === "Logged!" ? "success" : "error"} />}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    select
                    label="Meal Category"
                    size="small"
                    value={quickMeal.meal}
                    onChange={e => setQuickMeal({ ...quickMeal, meal: e.target.value })}
                  >
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Lunch">Lunch</MenuItem>
                    <MenuItem value="Dinner">Dinner</MenuItem>
                    <MenuItem value="Snack">Snack</MenuItem>
                  </TextField>
                  <TextField
                    label="Calories (kcal)"
                    type="number"
                    size="small"
                    value={quickMeal.calories}
                    onChange={e => setQuickMeal({ ...quickMeal, calories: e.target.value })}
                  />
                  <Button variant="contained" color="warning" onClick={handleQuickMeal} sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}>
                    Log Calorie
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Sleep Log */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, height: "100%", borderLeft: "5px solid #1565c0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>🛌 Quick Sleep</Typography>
                  {sleepMsg && <Chip label={sleepMsg} size="small" color={sleepMsg === "Logged!" ? "success" : "error"} />}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    label="Hours Slept"
                    type="number"
                    size="small"
                    value={quickSleep.hours}
                    onChange={e => setQuickSleep({ ...quickSleep, hours: e.target.value })}
                  />
                  <TextField
                    select
                    label="Sleep Quality"
                    size="small"
                    value={quickSleep.quality}
                    onChange={e => setQuickSleep({ ...quickSleep, quality: e.target.value })}
                  >
                    <MenuItem value="Restful">Restful</MenuItem>
                    <MenuItem value="LightSleep">Light Sleep</MenuItem>
                    <MenuItem value="Interrupted">Interrupted</MenuItem>
                    <MenuItem value="Insomnia">Insomnia</MenuItem>
                  </TextField>
                  <Button variant="contained" color="primary" onClick={handleQuickSleep} sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}>
                    Log Sleep
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stress Log */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, height: "100%", borderLeft: "5px solid #c2185b", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>🧠 Quick Stress</Typography>
                  {stressMsg && <Chip label={stressMsg} size="small" color={stressMsg === "Logged!" ? "success" : "error"} />}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    label="Stress Level (1-10)"
                    type="number"
                    size="small"
                    value={quickStress.level}
                    onChange={e => setQuickStress({ ...quickStress, level: parseInt(e.target.value) || 5 })}
                  />
                  <TextField
                    label="Triggers / Notes"
                    size="small"
                    placeholder="e.g. Work load, study..."
                    value={quickStress.notes}
                    onChange={e => setQuickStress({ ...quickStress, notes: e.target.value })}
                  />
                  <Button variant="contained" color="secondary" onClick={handleQuickStress} sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}>
                    Log Stress
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
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
