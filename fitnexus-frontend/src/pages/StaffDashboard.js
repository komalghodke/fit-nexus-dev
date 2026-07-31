import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api/apiConfig";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField
} from "@mui/material";
import {
  Groups,
  FitnessCenter,
  SelfImprovement,
  ExpandMore,
  ExpandLess,
  LocalHospital,
  TipsAndUpdates,
  Spa
} from "@mui/icons-material";

function StaffDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [reports, setReports] = useState({});
  const [logs, setLogs] = useState({}); // stores { userId: { workouts: [], sleep: [], stress: [], nutrition: [] } }

  const rawRole = localStorage.getItem("role") || "USER";
  const role = rawRole.trim().toUpperCase();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (role !== "YOGA_INSTRUCTOR" && role !== "GYM_TRAINER" && role !== "ADMIN") {
      setError("Access denied. Only staff members or administrators can view this dashboard.");
      setLoading(false);
      return;
    }
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter to only show regular members
      const members = res.data.filter(u => u.role === "USER" || !u.role);
      setUsers(members);
    } catch (err) {
      setError("Failed to load members. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (userId) => {
    if (reports[userId]) return; // already cached
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [res, workoutRes, sleepRes, stressRes, nutritionRes] = await Promise.all([
        axios.get(`${API_URL}/reports/${userId}`, { headers }),
        axios.get(`${API_URL}/workout/${userId}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/sleep/${userId}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/stress/${userId}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/nutrition/${userId}`, { headers }).catch(() => ({ data: [] }))
      ]);
      setReports(prev => ({ ...prev, [userId]: res.data }));
      setLogs(prev => ({
        ...prev,
        [userId]: {
          workouts: workoutRes.data || [],
          sleep: sleepRes.data || [],
          stress: stressRes.data || [],
          nutrition: nutritionRes.data || []
        }
      }));
    } catch {
      setReports(prev => ({ ...prev, [userId]: { error: true } }));
    }
  };

  const handleSaveNotes = async (userId, notesText) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_URL}/users/${userId}/notes`, { notes: notesText }, { headers });
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, staffNotes: notesText } : u));
      return true;
    } catch (err) {
      console.error("Failed to save notes:", err);
      return false;
    }
  };

  const toggleExpand = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      fetchReport(userId);
    }
  };

  const roleLabel = role === "YOGA_INSTRUCTOR" ? "Yoga Instructor" : "Gym Trainer";
  const roleIcon = role === "YOGA_INSTRUCTOR"
    ? <SelfImprovement sx={{ fontSize: 28, color: "#602e7d" }} />
    : <FitnessCenter sx={{ fontSize: 28, color: "#054474" }} />;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#602e7d" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "92vh", background: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background: role === "YOGA_INSTRUCTOR"
              ? "linear-gradient(135deg, #602e7d 0%, #9c27b0 50%, #7b1fa2 100%)"
              : "linear-gradient(135deg, #054474 0%, #1565c0 50%, #0d47a1 100%)",
            color: "#fff",
            boxShadow: role === "YOGA_INSTRUCTOR"
              ? "0 8px 32px rgba(96, 46, 125, 0.4)"
              : "0 8px 32px rgba(5, 68, 116, 0.4)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                {roleIcon}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {role === "YOGA_INSTRUCTOR" ? "🪷 YCB Yoga Master Console" : "🏋️‍♂️ Fitness & Performance Console"}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Logged in as <strong>{roleLabel}</strong> — {role === "YOGA_INSTRUCTOR" ? "Prescribe asanas, pranayama & chakra alignment" : "Track workouts, macros & body composition"}
                </Typography>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <Chip
                  icon={<Groups />}
                  label={`${users.length} Members`}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: "bold", fontSize: "0.9rem" }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>Member</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, idx) => (
                    <React.Fragment key={user.id}>
                      <TableRow
                        hover
                        sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#faf6ff" } }}
                        onClick={() => toggleExpand(user.id)}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: "#602e7d", width: 36, height: 36, fontSize: 14 }}>
                              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {user.username || "—"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={`#${user.id}`} size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            endIcon={expandedUserId === user.id ? <ExpandLess /> : <ExpandMore />}
                            sx={{ textTransform: "none", color: "#602e7d", fontWeight: 600 }}
                          >
                            {expandedUserId === user.id ? "Hide Report" : "View Report"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Report Row */}
                      <TableRow>
                        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                          <Collapse in={expandedUserId === user.id} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3, background: "#faf6ff" }}>
                              {!reports[user.id] ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                                  <CircularProgress size={28} sx={{ color: "#602e7d" }} />
                                </Box>
                              ) : reports[user.id].error ? (
                                <Alert severity="info" sx={{ borderRadius: 2 }}>
                                  No wellness assessment submitted yet by this member.
                                </Alert>
                              ) : (
                                <ReportCard
                                  report={reports[user.id]}
                                  user={user}
                                  logs={logs[user.id]}
                                  role={role}
                                  onSaveNotes={handleSaveNotes}
                                />
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography variant="body1" color="text.secondary">
                          No members registered yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

/** Inline Report Card Component */
function ReportCard({ report, user, logs, role, onSaveNotes }) {
  const [notesText, setNotesText] = React.useState(user.staffNotes || "");
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("report"); // report, logs, advice

  const scoreColor = report.score >= 8 ? "#2e7d32" : report.score >= 5 ? "#ed6c02" : "#d32f2f";

  const yogaPresets = [
    "🧘 Daily Practice: 10 rounds of Anulom-Vilom & 15 mins Yoga Nidra for stress reduction.",
    "☀️ Daily Practice: 6 rounds of Surya Namaskar (Sun Salutations) followed by Shavasana.",
    "🌾 Dietary Guidelines: Focus on Sattvic food (fresh fruits, organic grains). Limit processed foods.",
    "📿 Chakra Alignment: Meditate on the seed mantra 'So Hum' (10 mins) daily for heart chakra opening."
  ];

  const gymPresets = [
    "🏋️ Routine: 3 sets of Bodyweight Squats (15 reps), Pushups (10 reps), and Plank (45 secs).",
    "🏃 Cardio Activity: 25 minutes of brisk walking or cycling at a moderate pace (HR ~120-130 BPM).",
    "🥗 Nutrition Guidelines: Increase lean protein intake to 1.2g per kg of bodyweight. Add a daily post-workout shake.",
    "💧 Hydration Target: Aim for a minimum of 3.0 Liters of water daily to support metabolic recovery."
  ];

  const presets = role === "YOGA_INSTRUCTOR" ? yogaPresets : gymPresets;

  const handleInsertPreset = (preset) => {
    setNotesText(prev => prev ? prev + "\n" + preset : preset);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const success = await onSaveNotes(user.id, notesText);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const memberLogs = logs || { workouts: [], sleep: [], stress: [], nutrition: [] };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Sub navigation Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, borderBottom: "1px solid #ddd", pb: 1 }}>
        <Button
          size="small"
          variant={activeTab === "report" ? "contained" : "text"}
          color="secondary"
          onClick={() => setActiveTab("report")}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          {role === "YOGA_INSTRUCTOR" ? "🧘 Holistic Wellness" : "📊 Body & Performance"}
        </Button>
        <Button
          size="small"
          variant={activeTab === "logs" ? "contained" : "text"}
          color="secondary"
          onClick={() => setActiveTab("logs")}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          {role === "YOGA_INSTRUCTOR" ? "🕉️ Chakra & Mindfulness Logs" : "📝 Workout & Recovery Logs"}
        </Button>
        <Button
          size="small"
          variant={activeTab === "advice" ? "contained" : "text"}
          color="secondary"
          onClick={() => setActiveTab("advice")}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          {role === "YOGA_INSTRUCTOR" ? "💿 Asana & Pranayama Rx" : "🏋️ Training Plan Rx"}
        </Button>
      </Box>

      {activeTab === "report" && (
        <Grid container spacing={3}>
          {/* Score Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ py: 3 }}>
                <Typography variant="overline" sx={{ color: "#666" }}>Wellness Score</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, color: scoreColor }}>
                  {report.score}/10
                </Typography>
                <Chip
                  label={report.status}
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    bgcolor: scoreColor,
                    color: "#fff"
                  }}
                />
                <Typography variant="body2" sx={{ mt: 2, color: "#555" }}>
                  Age: {report.age} | Height: {report.height} cm | Weight: {report.weight} kg | BMI: {report.bmi ? report.bmi.toFixed(1) : "—"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: "#555" }}>
                  Heart Rate: {report.restingHeartRate || 72} bpm | Sleep: {report.sleepHours || 8} hrs | Mood: {report.mood || "Balanced"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Summaries */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#054474", mb: 1 }}>
                  📊 Log Summaries
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="body2" sx={{ mb: 0.5 }}>💪 {report.workoutSummary}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>🥗 {report.nutritionSummary}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>🌙 {report.sleepSummary}</Typography>
                <Typography variant="body2">🧘 {report.stressSummary}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Yoga Instructor: Chakra & Pranayama | Gym Trainer: Macros & Body Composition */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                {role === "YOGA_INSTRUCTOR" ? (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#602e7d", mb: 1 }}>
                      🕉️ Chakra & Pranayama Prescription
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Active Chakra:</strong> {report.chakra || "Anahata (Heart)"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Recommended Asanas:</strong> {report.yogaRecommendation || "Surya Namaskar, Tadasana, Bhujangasana"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Pranayama:</strong> Anulom Vilom (5 min), Bhramari (3 rounds), Kapalbhati (2 min)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Mantra:</strong> {report.mantra || "Om Shanti"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555" }}>
                      &ldquo;{report.affirmation || 'My body is a temple of light and peace.'}&rdquo;
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#054474", mb: 1 }}>
                      🧑‍🍳 Macros & Body Composition
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>BMI:</strong> {report.bmi ? report.bmi.toFixed(1) : "—"} ({report.bmi >= 25 ? "Overweight" : report.bmi >= 18.5 ? "Normal" : "Underweight"})
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Weight:</strong> {report.weight} kg | <strong>Height:</strong> {report.height} cm
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Daily Protein Target:</strong> {report.weight ? (report.weight * 1.6).toFixed(0) : "—"}g (1.6g/kg)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Estimated TDEE:</strong> ~{report.weight ? (report.weight * 30).toFixed(0) : "—"} kcal/day
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Predicted Calorie Burn:</strong> {report.predictedCalorieBurn || "—"} kcal/session
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555" }}>
                      Macro Split: 40% Protein, 35% Carbs, 25% Healthy Fats
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Wellness Tips */}
          {report.wellnessTips && report.wellnessTips.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#054474", mb: 1 }}>
                    <TipsAndUpdates sx={{ fontSize: 18, mr: 0.5, verticalAlign: "text-bottom" }} />
                    Personalized Wellness Tips
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <List dense>
                    {report.wellnessTips.map((tip, i) => (
                      <ListItem key={i}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Spa sx={{ color: "#602e7d", fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Medical Advisory */}
          {report.medicalAdvisory && (
            <Grid item xs={12}>
              <Alert
                severity="warning"
                icon={<LocalHospital />}
                sx={{ borderRadius: 2, fontWeight: 500 }}
              >
                {report.medicalAdvisory}
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === "logs" && (
        <Grid container spacing={3}>
          {role === "YOGA_INSTRUCTOR" ? (
            <>
              {/* Yoga Instructor: Mindfulness & Mood Logs */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#602e7d", mb: 1 }}>
                    🧘 Meditation & Mindfulness ({memberLogs.stress.length} entries)
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.stress.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No mindfulness logs yet. Encourage member to practice daily reflection.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.stress.map((str, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#faf6ff", borderRadius: 2, border: "1px solid rgba(96,46,125,0.1)" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Stress Level: {str.level}/10</Typography>
                          <Typography variant="caption" color="text.secondary">Inner Peace Notes: {str.notes || "None"} | {str.createdAt ? new Date(str.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#7b1fa2", mb: 1 }}>
                    🌜 Sleep & Circadian Balance ({memberLogs.sleep.length} entries)
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.sleep.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No sleep logs yet. Recommend Yoga Nidra practice.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.sleep.map((s, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#faf6ff", borderRadius: 2, border: "1px solid rgba(96,46,125,0.1)" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.hours} hours slept</Typography>
                          <Typography variant="caption" color="text.secondary">Quality: {s.quality} | {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2e7d32", mb: 1 }}>
                    🥗 Sattvic Diet & Nutrition ({memberLogs.nutrition.length} entries)
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.nutrition.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No diet entries. Guide member toward sattvic eating habits.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.nutrition.map((n, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#f0fff0", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{n.meal} — {n.calories} kcal</Typography>
                          <Typography variant="caption" color="text.secondary">{n.notes} | {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#e65100", mb: 1 }}>
                    🧘‍♀️ Asana & Movement ({memberLogs.workouts.length} entries)
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.workouts.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No asana practice logged. Prescribe a beginner sequence.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.workouts.map((w, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#fff3e0", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{w.type} — {w.duration} mins</Typography>
                          <Typography variant="caption" color="text.secondary">Intensity: {w.intensity || "Gentle"} | {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
            </>
          ) : (
            <>
              {/* Gym Trainer: Workout, Nutrition, Sleep Recovery, Stress */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#054474", mb: 1 }}>
                    💪 Workout & Strength Log ({memberLogs.workouts.length})
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.workouts.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No workout entries. Assign a starter routine.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.workouts.map((w, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{w.type} — {w.duration} mins</Typography>
                          <Typography variant="caption" color="text.secondary">Intensity: {w.intensity || "Medium"} | MET Burn: ~{Math.round((w.duration || 30) * 5.5)} kcal | {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#e65100", mb: 1 }}>
                    🥩 Meal & Macro Tracker ({memberLogs.nutrition.length})
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.nutrition.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No meals logged. Set up a macro plan.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.nutrition.map((n, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#fff3e0", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{n.meal} — {n.calories} kcal</Typography>
                          <Typography variant="caption" color="text.secondary">{n.notes} | {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1565c0", mb: 1 }}>
                    💤 Sleep & Muscle Recovery ({memberLogs.sleep.length})
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.sleep.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No sleep data. Remind member that 7-8hrs is critical for gains.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.sleep.map((s, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.hours} hrs slept — Recovery: {s.hours >= 7 ? "✅ Optimal" : "⚠️ Low"}</Typography>
                          <Typography variant="caption" color="text.secondary">Quality: {s.quality} | {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 3, p: 2, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#c2185b", mb: 1 }}>
                    🧠 Fatigue & Overtraining Check ({memberLogs.stress.length})
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {memberLogs.stress.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No stress logs. Monitor for overtraining signs.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
                      {memberLogs.stress.map((str, i) => (
                        <Box key={i} sx={{ mb: 1, p: 1, bgcolor: "#fce4ec", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Stress: {str.level}/10 {str.level >= 7 ? "— ⚠️ Deload Recommended" : ""}</Typography>
                          <Typography variant="caption" color="text.secondary">{str.notes || "None"} | {str.createdAt ? new Date(str.createdAt).toLocaleDateString() : "Today"}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}

      {activeTab === "advice" && (
        <Card sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: role === "YOGA_INSTRUCTOR" ? "#602e7d" : "#054474" }}>
            {role === "YOGA_INSTRUCTOR" ? "💿 Prescribe Asana, Pranayama & Spiritual Guidance" : "🏋️ Prescribe Workout Routines & Nutrition Plans"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            {role === "YOGA_INSTRUCTOR"
              ? "Your yogic prescriptions (asanas, pranayama, mantras, and dietary guidance) will be saved and visible to the member."
              : "Your training plan (workout splits, rep ranges, macro targets, and recovery protocols) will be saved and visible to the member."}
          </Typography>

          <Grid container spacing={3}>
            {/* Presets Column */}
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Click to Insert Presets
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {presets.map((preset, i) => (
                  <Button
                    key={i}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleInsertPreset(preset)}
                    sx={{
                      textTransform: "none",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      fontSize: "0.75rem",
                      py: 1,
                      px: 1.5,
                      borderColor: "rgba(96, 46, 125, 0.2)",
                      "&:hover": { borderColor: "#602e7d", bgcolor: "rgba(96, 46, 125, 0.02)" }
                    }}
                  >
                    {preset.substring(0, 48)}...
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* Note Editor Column */}
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Type your recommendations, fitness split, diet guidelines, or spiritual practices..."
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 3 }
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={saving}
                  onClick={handleSave}
                  sx={{
                    px: 3,
                    borderRadius: 2.5,
                    fontWeight: "bold",
                    textTransform: "none"
                  }}
                >
                  {saving ? "Saving Guidance..." : "Save Guidance"}
                </Button>
                {saveSuccess && (
                  <Chip
                    label="Guidance saved successfully!"
                    color="success"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
}

export default StaffDashboard;
