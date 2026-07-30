import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Button, Avatar, Divider, CircularProgress, Chip,
  TextField, MenuItem, LinearProgress, IconButton
} from "@mui/material";
import {
  FitnessCenter, Restaurant, Bedtime, Psychology,
  Assignment, AccountCircle, TrendingUp, SelfImprovement,
  CheckCircle, Spa, Air, Favorite, WaterDrop,
  LightMode, NightsStay, PlayArrow, Pause
} from "@mui/icons-material";
import { API_URL } from "../api/apiConfig";

// ── Daily Affirmations ──────────────────────────────────────────────
const DAILY_AFFIRMATIONS = [
  { quote: "Inhale peace, exhale tension. Balance is not something you find — it's something you create.", icon: "🧘" },
  { quote: "The body achieves what the mind believes. Today, choose to move with intention and gratitude.", icon: "🌿" },
  { quote: "Wellness is not a destination. It is the gentle art of returning to yourself, breath by breath.", icon: "🌸" },
  { quote: "Your body is your first home. Nourish it, move it, rest it, and love it deeply.", icon: "💛" },
  { quote: "Every sunrise is an invitation to begin again. Let today be a day of mindful living.", icon: "🌅" },
  { quote: "Stillness is not the absence of movement — it is the presence of peace within.", icon: "🕊️" },
  { quote: "You don't need to be flexible to start yoga. You just need to be willing to breathe.", icon: "🫁" },
  { quote: "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship. — Buddha", icon: "📿" },
  { quote: "Nature does not hurry, yet everything is accomplished. Trust your rhythm. — Lao Tzu", icon: "🍃" },
  { quote: "The quieter you become, the more you can hear. Listen to your body today.", icon: "🔔" },
  { quote: "Prana is the bridge between body and mind. Breathe deeply, live fully.", icon: "🌬️" },
  { quote: "Small steps every day lead to big transformations. Celebrate your consistency.", icon: "🪷" },
  { quote: "Your wellness score is not a judgment — it's a compass. Let it guide, not define you.", icon: "🧭" },
  { quote: "Sleep is the best meditation. Give your body the rest it deserves tonight. — Dalai Lama", icon: "🌙" },
  { quote: "Eat food that loves you back. Every meal is an opportunity to nourish your temple.", icon: "🥗" },
  { quote: "In the rush of daily life, pause. One conscious breath can change your entire day.", icon: "✨" },
  { quote: "Your body hears everything your mind says. Speak kindly to yourself today.", icon: "💜" },
  { quote: "Yoga is the journey of the self, through the self, to the self. — Bhagavad Gita", icon: "🕉️" },
  { quote: "Movement is medicine. Even five minutes of stretching can shift your energy.", icon: "🌟" },
  { quote: "Gratitude turns what we have into enough. Today, find three things to be grateful for.", icon: "🙏" },
  { quote: "Healing is not linear. Be patient with yourself. Progress is progress, no matter how small.", icon: "🦋" },
  { quote: "The food you eat can be either the safest medicine or the slowest poison. Choose wisely.", icon: "🍎" },
  { quote: "Breathe in courage, breathe out fear. You are stronger than you think.", icon: "💪" },
  { quote: "Meditation is not about emptying the mind — it's about observing it without judgment.", icon: "🧠" },
  { quote: "When you own your breath, nobody can steal your peace. — Unknown", icon: "🌈" },
  { quote: "A calm mind brings inner strength and self-confidence. That is very important for good health. — Dalai Lama", icon: "⛰️" },
  { quote: "Let your practice be a celebration, not a punishment. Move with joy.", icon: "🎶" },
  { quote: "Water is the driving force of all nature. Stay hydrated, stay alive. — Leonardo da Vinci", icon: "💧" },
  { quote: "The wound is the place where the Light enters you. — Rumi", icon: "🌻" },
  { quote: "Be where you are. Not where you think you should be. — Anonymous", icon: "🌺" },
  { quote: "Rest when you need to. Your value is not measured by your productivity.", icon: "☕" }
];

function getTodayAffirmation() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length];
}

// ── Stat Card Component ─────────────────────────────────────────────
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

// ── Breathing Exercise Widget ───────────────────────────────────────
function BreathingWidget() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState("ready"); // ready | inhale | hold | exhale
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  const INHALE = 4, HOLD = 7, EXHALE = 8;

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        const next = prev + 1;
        if (phase === "inhale" && next >= INHALE) { setPhase("hold"); return 0; }
        if (phase === "hold" && next >= HOLD) { setPhase("exhale"); return 0; }
        if (phase === "exhale" && next >= EXHALE) {
          setCycles(c => c + 1);
          setPhase("inhale");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, phase]);

  const start = () => { setActive(true); setPhase("inhale"); setTimer(0); setCycles(0); };
  const stop = () => { setActive(false); setPhase("ready"); setTimer(0); };

  const phaseConfig = {
    ready: { label: "Press Play to Begin", color: "#602e7d", progress: 0, max: 1 },
    inhale: { label: "Inhale deeply...", color: "#1565c0", progress: timer, max: INHALE },
    hold: { label: "Hold gently...", color: "#e65100", progress: timer, max: HOLD },
    exhale: { label: "Exhale slowly...", color: "#2e7d32", progress: timer, max: EXHALE }
  };
  const cfg = phaseConfig[phase];

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: "linear-gradient(135deg, #fdf8ff 0%, #f0f7ff 100%)",
        border: "1px solid rgba(96,46,125,0.12)",
        boxShadow: "0 4px 20px rgba(96,46,125,0.06)",
        overflow: "hidden"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar sx={{ bgcolor: "#602e7d", width: 38, height: 38 }}>
            <Air sx={{ fontSize: "1.2rem" }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#602e7d" }}>
              🫁 Mindful Breathing — 4-7-8 Technique
            </Typography>
            <Typography variant="caption" sx={{ color: "#888" }}>
              Inhale 4s · Hold 7s · Exhale 8s — Calms the nervous system
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", py: 2 }}>
          {/* Animated circle */}
          <Box
            sx={{
              width: 100, height: 100, borderRadius: "50%", mx: "auto", mb: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `radial-gradient(circle, ${cfg.color}15 0%, ${cfg.color}05 100%)`,
              border: `3px solid ${cfg.color}`,
              transition: "all 1s ease",
              transform: phase === "inhale" ? "scale(1.15)" : phase === "exhale" ? "scale(0.85)" : "scale(1)",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, color: cfg.color }}>
              {phase === "ready" ? "🧘" : phase === "inhale" ? timer : phase === "hold" ? timer : timer}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ fontWeight: 700, color: cfg.color, mb: 1 }}>
            {cfg.label}
          </Typography>

          {active && (
            <LinearProgress
              variant="determinate"
              value={(cfg.progress / cfg.max) * 100}
              sx={{
                height: 6, borderRadius: 3, mb: 1.5, mx: "auto", maxWidth: 200,
                bgcolor: `${cfg.color}15`,
                "& .MuiLinearProgress-bar": { bgcolor: cfg.color, borderRadius: 3 }
              }}
            />
          )}

          {cycles > 0 && (
            <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 1 }}>
              {cycles} cycle{cycles > 1 ? "s" : ""} completed 🌟
            </Typography>
          )}

          <IconButton
            onClick={active ? stop : start}
            sx={{
              bgcolor: active ? "#c2185b20" : "#602e7d15",
              color: active ? "#c2185b" : "#602e7d",
              "&:hover": { bgcolor: active ? "#c2185b30" : "#602e7d25" },
              width: 48, height: 48
            }}
          >
            {active ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────
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

  // Insight data
  const [allSleeps, setAllSleeps]     = useState([]);
  const [allStresses, setAllStresses] = useState([]);

  const token  = localStorage.getItem("token");
  const email  = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const role   = localStorage.getItem("role");

  const loadStats = useCallback((showSpinner = false) => {
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
        const stresses = str.data || [];
        setAllSleeps(sleeps);
        setAllStresses(stresses);

        const avgSleep = sleeps.length
          ? (sleeps.reduce((s, x) => s + (x.hours || 0), 0) / sleeps.length).toFixed(1)
          : "—";
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
  }, [token, email, userId, navigate]);

  useEffect(() => {
    if (!token || !email) { navigate("/login"); return; }
    const r = (role || "USER").trim().toUpperCase();
    if (r === "YOGA_INSTRUCTOR" || r === "GYM_TRAINER") {
      navigate("/staff");
      return;
    }
    if (r === "ADMIN") {
      navigate("/admin");
      return;
    }
    loadStats(true);
  }, [token, email, role, navigate, loadStats]);

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

  const totalLogs = stats.workouts + stats.mealCount + (allSleeps.length || 0) + (allStresses.length || 0);
  const todayComplete = Object.values(todayLogs).filter(Boolean).length;

  // Sleep insight
  const sleepInsight = allSleeps.length >= 2
    ? (() => {
        const recent = allSleeps.slice(-3);
        const avg = recent.reduce((s, x) => s + (x.hours || 0), 0) / recent.length;
        if (avg >= 7.5) return { label: "Excellent Sleep", color: "#2e7d32", emoji: "🌟", tip: "Your recent sleep is above 7.5 hrs average. Keep it up!" };
        if (avg >= 6) return { label: "Moderate Sleep", color: "#e65100", emoji: "🌤️", tip: `Recent avg: ${avg.toFixed(1)} hrs. Try sleeping 30 mins earlier tonight.` };
        return { label: "Needs Attention", color: "#c62828", emoji: "⚠️", tip: `Recent avg: ${avg.toFixed(1)} hrs. Practice Yoga Nidra before bed.` };
      })()
    : { label: "Log More Data", color: "#888", emoji: "📊", tip: "Log 2+ sleep entries to see your trend." };

  // Stress insight
  const stressInsight = allStresses.length >= 2
    ? (() => {
        const recent = allStresses.slice(-3);
        const avg = recent.reduce((s, x) => s + (x.level || 0), 0) / recent.length;
        if (avg <= 3) return { label: "Low Stress", color: "#2e7d32", emoji: "😌", tip: "You're managing stress well. Continue your pranayama practice!" };
        if (avg <= 6) return { label: "Moderate Stress", color: "#e65100", emoji: "😐", tip: `Recent avg: ${avg.toFixed(1)}/10. Try 5 min Nadi Shodhana breathing.` };
        return { label: "High Stress", color: "#c62828", emoji: "🔴", tip: `Recent avg: ${avg.toFixed(1)}/10. Consider Bhramari pranayama & journaling.` };
      })()
    : { label: "Log More Data", color: "#888", emoji: "📊", tip: "Log 2+ stress entries to see your trend." };

  const quickStats = [
    { icon: <FitnessCenter />, label: "Workouts",     value: stats.workouts, unit: "logged",   color: "#2e7d32", bg: "#f1f8e9" },
    { icon: <Bedtime />,       label: "Avg Sleep",    value: stats.sleepAvg, unit: "hrs",      color: "#1565c0", bg: "#e3f2fd" },
    { icon: <Psychology />,    label: "Last Stress",  value: stats.stressLast, unit: "",       color: "#c2185b", bg: "#fce4ec" },
    { icon: <Restaurant />,    label: "Meals Logged", value: stats.mealCount, unit: "entries", color: "#e65100", bg: "#fff3e0" }
  ];

  const affirmation = getTodayAffirmation();

  return (
    <Box sx={{ minHeight: "90vh", background: "#f8f9fc" }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>

        {/* ── Welcome Banner ─────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex", alignItems: "center", flexWrap: "wrap",
            justifyContent: "space-between", gap: 3, mb: 4, p: 4,
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
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: -0.5,
                  background: "linear-gradient(90deg, #ffe082 0%, #a5d6a7 50%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
                }}
              >
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
                {todayComplete === 4 && (
                  <Chip label="✨ All Logged Today!" size="small"
                    sx={{ bgcolor: "rgba(76,175,80,0.3)", color: "#fff", fontWeight: 700, fontSize: "0.7rem", border: "1px solid rgba(76,175,80,0.5)" }} />
                )}
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

        {/* ── Daily Mindful Affirmation ──────────────────────────── */}
        <Card
          sx={{
            mb: 4, borderRadius: 4,
            background: "linear-gradient(135deg, #faf6ff 0%, #f5f0ff 50%, #fdf8ff 100%)",
            border: "1px solid rgba(96,46,125,0.1)",
            boxShadow: "0 4px 20px rgba(96,46,125,0.06)",
            position: "relative", overflow: "hidden"
          }}
        >
          {/* Decorative orb */}
          <Box sx={{
            position: "absolute", top: -30, right: -30, width: 120, height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,46,125,0.08) 0%, transparent 70%)",
            filter: "blur(8px)"
          }} />
          <CardContent sx={{ p: { xs: 3, md: 4 }, position: "relative" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Typography sx={{ fontSize: "2.5rem", lineHeight: 1 }}>{affirmation.icon}</Typography>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 800, color: "#602e7d", letterSpacing: 2 }}>
                  ✨ Today's Mindful Reflection
                </Typography>
                <Typography variant="h6" sx={{
                  fontWeight: 600, color: "#3f2652", fontStyle: "italic",
                  lineHeight: 1.6, mt: 0.5, maxWidth: 700
                }}>
                  "{affirmation.quote}"
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* ── Quick Stats ─────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickStats.map((s, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* ── Wellness Insights Row ──────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Sleep Insight */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 4, height: "100%",
              borderLeft: `5px solid ${sleepInsight.color}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <NightsStay sx={{ color: sleepInsight.color, fontSize: "1.2rem" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: sleepInsight.color }}>
                    Sleep Trend
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "1.8rem", mb: 0.5 }}>{sleepInsight.emoji}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: sleepInsight.color, mb: 0.5 }}>
                  {sleepInsight.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "#777", lineHeight: 1.5 }}>
                  {sleepInsight.tip}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Stress Insight */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 4, height: "100%",
              borderLeft: `5px solid ${stressInsight.color}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Psychology sx={{ color: stressInsight.color, fontSize: "1.2rem" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: stressInsight.color }}>
                    Stress Trend
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "1.8rem", mb: 0.5 }}>{stressInsight.emoji}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: stressInsight.color, mb: 0.5 }}>
                  {stressInsight.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "#777", lineHeight: 1.5 }}>
                  {stressInsight.tip}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Wellness Journey Milestone */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 4, height: "100%",
              borderLeft: "5px solid #602e7d",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Favorite sx={{ color: "#602e7d", fontSize: "1.2rem" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#602e7d" }}>
                    Your Journey
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: "#602e7d", lineHeight: 1 }}>
                  {totalLogs}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#602e7d", mb: 0.5 }}>
                  Total Wellness Logs
                </Typography>
                <Typography variant="caption" sx={{ color: "#777", lineHeight: 1.5 }}>
                  {totalLogs === 0 ? "Start logging to build your wellness story!" :
                   totalLogs < 10 ? "Great start! Keep building your wellness habit." :
                   totalLogs < 50 ? "You're building a beautiful wellness journey! 🌿" :
                   "Incredible dedication! You're a wellness champion! 🏆"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Progress */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              borderRadius: 4, height: "100%",
              borderLeft: `5px solid ${todayComplete === 4 ? "#2e7d32" : "#e65100"}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <LightMode sx={{ color: todayComplete === 4 ? "#2e7d32" : "#e65100", fontSize: "1.2rem" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: todayComplete === 4 ? "#2e7d32" : "#e65100" }}>
                    Today's Mindfulness
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: todayComplete === 4 ? "#2e7d32" : "#e65100", lineHeight: 1 }}>
                  {todayComplete}/4
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: todayComplete === 4 ? "#2e7d32" : "#e65100", mb: 0.5 }}>
                  Dimensions Logged
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(todayComplete / 4) * 100}
                  sx={{
                    height: 6, borderRadius: 3, mt: 1,
                    bgcolor: "#eee",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: todayComplete === 4 ? "#2e7d32" : "#e65100",
                      borderRadius: 3
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Breathing + Tracker + Guidelines Row ──────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Breathing Widget */}
          <Grid item xs={12} md={4}>
            <BreathingWidget />
          </Grid>

          {/* Daily Tracker Checklist */}
          <Grid item xs={12} md={profile?.staffNotes ? 4 : 8}>
            <Card
              sx={{
                borderRadius: 4, height: "100%",
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
                          p: 1.2, px: 2, borderRadius: 2.5,
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
                            fontWeight: 700, fontSize: "0.65rem", height: 20,
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

          {/* Guidelines Card (conditional) */}
          {profile?.staffNotes && (
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 4, height: "100%",
                  background: "linear-gradient(135deg, #ffffff 0%, #fbf8ff 100%)",
                  border: "1px solid rgba(96, 46, 125, 0.15)",
                  boxShadow: "0 4px 20px rgba(96, 46, 125, 0.05)",
                  position: "relative", overflow: "hidden"
                }}
              >
                {/* Decorative corner glow */}
                <Box
                  sx={{
                    position: "absolute", top: -40, right: -40, width: 120, height: 120,
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
                        📢 Trainer Guidelines
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Personalised by your instructor
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      p: 2.5, bgcolor: "#faf6ff", borderRadius: 3,
                      borderLeft: "4px solid #602e7d", minHeight: 80
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
        </Grid>

        {/* ── Quick-Log Desk ─────────────────────────────────────── */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
          ⚡ FitNexus Quick-Log Desk
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
                    select label="Workout Type" size="small"
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
                    label="Duration (mins)" type="number" size="small"
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
                    select label="Meal Category" size="small"
                    value={quickMeal.meal}
                    onChange={e => setQuickMeal({ ...quickMeal, meal: e.target.value })}
                  >
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Lunch">Lunch</MenuItem>
                    <MenuItem value="Dinner">Dinner</MenuItem>
                    <MenuItem value="Snack">Snack</MenuItem>
                  </TextField>
                  <TextField
                    label="Calories (kcal)" type="number" size="small"
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
                    label="Hours Slept" type="number" size="small"
                    value={quickSleep.hours}
                    onChange={e => setQuickSleep({ ...quickSleep, hours: e.target.value })}
                  />
                  <TextField
                    select label="Sleep Quality" size="small"
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
                    label="Stress Level (1-10)" type="number" size="small"
                    value={quickStress.level}
                    onChange={e => setQuickStress({ ...quickStress, level: parseInt(e.target.value) || 5 })}
                  />
                  <TextField
                    label="Triggers / Notes" size="small" placeholder="e.g. Work load, study..."
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
            borderLeft: "6px solid #602e7d", mb: 4, background: "#fdf8ff"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Assignment sx={{ color: "#602e7d", fontSize: "1.8rem" }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      background: "linear-gradient(90deg, #602e7d 0%, #054474 50%, #2e7d32 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
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

        {/* ── View Reports Link ───────────────────────────────────── */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
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
