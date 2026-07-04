import React, { useState, useEffect } from "react";
import axios from "axios";
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
  ListItemText
} from "@mui/material";
import {
  Groups,
  Person,
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

  const role = localStorage.getItem("role") || "USER";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (role !== "YOGA_INSTRUCTOR" && role !== "GYM_TRAINER") {
      setError("Access denied. Only staff members can view this dashboard.");
      setLoading(false);
      return;
    }
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
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
      const res = await axios.get(`http://localhost:8080/api/reports/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(prev => ({ ...prev, [userId]: res.data }));
    } catch {
      setReports(prev => ({ ...prev, [userId]: { error: true } }));
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
            background: "linear-gradient(135deg, #054474 0%, #602e7d 100%)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(96, 46, 125, 0.3)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                {roleIcon}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  🪷 Staff Console
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Logged in as <strong>{roleLabel}</strong> — View member wellness data and reports
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
                                <ReportCard report={reports[user.id]} />
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
function ReportCard({ report }) {
  const scoreColor = report.score >= 8 ? "#2e7d32" : report.score >= 5 ? "#ed6c02" : "#d32f2f";

  return (
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

      {/* Yoga Recommendation */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#602e7d", mb: 1 }}>
              🧘 Yoga Prescription
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Routine:</strong> {report.yogaRecommendation || "—"}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Mantra:</strong> {report.mantra || "—"}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555" }}>
              &ldquo;{report.affirmation || '—'}&rdquo;
            </Typography>
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
  );
}

export default StaffDashboard;
