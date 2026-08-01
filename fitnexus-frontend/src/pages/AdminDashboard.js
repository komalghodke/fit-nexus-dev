import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL, CORPORATE_URL } from "../api/apiConfig";
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
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Collapse
} from "@mui/material";
import {
  SupervisorAccount,
  People,
  Assignment,
  Search,
  Delete,
  Security,
  Map,
  ArrowForward,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Save,
  Assessment
} from "@mui/icons-material";

const API = API_URL;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    userCount: 0,
    yogaCount: 0,
    gymCount: 0,
    adminCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // States for expandable reports & notes
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [reports, setReports] = useState({});
  const [editingNotes, setEditingNotes] = useState({});

  // States for Corporate Partner Inquiries from C#
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  // States for User Feedbacks
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
    fetchInquiries();
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get(`${CORPORATE_URL}/api/corporate/inquiries`);
      setInquiries(res.data || []);
    } catch (err) {
      console.warn("Failed to load corporate inquiries from .NET dashboard endpoint:", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API}/feedback`);
      setFeedbacks(res.data || []);
    } catch (err) {
      console.warn("Failed to load user feedbacks:", err);
    } finally {
      setFeedbacksLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${API}/users`, { headers }),
        axios.get(`${API}/users/stats`, { headers })
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);

      // Initialize editingNotes with existing values
      const initialNotes = {};
      usersRes.data.forEach(u => {
        initialNotes[u.id] = u.staffNotes || "";
      });
      setEditingNotes(initialNotes);
    } catch (err) {
      setError("Failed to load admin dashboard data. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `${API}/users/${userId}/role?role=${newRole}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("User role updated successfully!");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      const statsRes = await axios.get(`${API}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also remove their wellness inputs and reports!")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("User deleted successfully!");
      setUsers(prev => prev.filter(u => u.id !== userId));
      const statsRes = await axios.get(`${API}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleSaveNotes = async (userId) => {
    setError("");
    setSuccess("");
    try {
      const noteText = editingNotes[userId] || "";
      await axios.put(
        `${API}/users/${userId}/notes`,
        { notes: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Notes saved successfully!");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, staffNotes: noteText } : u));
    } catch (err) {
      setError("Failed to save notes.");
    }
  };

  const handleNoteChange = (userId, value) => {
    setEditingNotes(prev => ({ ...prev, [userId]: value }));
  };

  const fetchReport = async (userId) => {
    if (reports[userId]) return; // cached
    try {
      const res = await axios.get(`${API}/reports/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(prev => ({ ...prev, [userId]: res.data }));
    } catch {
      setReports(prev => ({ ...prev, [userId]: { error: true } }));
    }
  };

  const toggleExpandReport = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      fetchReport(userId);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#602e7d" }} />
      </Box>
    );
  }

  const statItems = [
    { label: "Total Members", count: stats.userCount, color: "#2e7d32", bg: "#f1f8e9", icon: <People /> },
    { label: "Yoga Instructors", count: stats.yogaCount, color: "#602e7d", bg: "#f3e5f5", icon: <Security /> },
    { label: "Gym Trainers", count: stats.gymCount, color: "#054474", bg: "#e3f2fd", icon: <Security /> },
    { label: "Total Assessments", count: stats.totalAssessments, color: "#e65100", bg: "#fff3e0", icon: <Assignment /> },
    { label: "User Feedbacks", count: feedbacks.length, color: "#c2185b", bg: "#fce4ec", icon: <Assessment /> }
  ];

  return (
    <Box sx={{ minHeight: "92vh", background: "#f5f5f5", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0d2c4e 0%, #602e7d 100%)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(96, 46, 125, 0.3)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                <SupervisorAccount sx={{ fontSize: 28, color: "#b39ddb" }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ⚙️ Admin Command Center
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Monitor system stats, update roles, manage logs, record staff/member notes, and view wellness reports.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {statItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={2.4} key={idx}>
              <Card sx={{ borderRadius: 4, bgcolor: item.bg, border: `1px solid ${item.color}22` }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
                  <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 44, height: 44 }}>
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>{item.label}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: item.color }}>{item.count}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions / Shortcuts */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#333", mb: 2 }}>
          ⚡ Admin Shortcuts
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ borderRadius: 3, borderLeft: "5px solid #602e7d" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Staff Console</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Access the Instructor & Trainer dashboards to manage programs and view wellness assessments.
                </Typography>
                <Button component={Link} to="/staff" variant="outlined" size="small" color="secondary" endIcon={<ArrowForward />}>
                  Open Staff View
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ borderRadius: 3, borderLeft: "5px solid #054474" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Wellness Map</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Open the interactive gyms, yoga centers, and AYUSH wellness facilities locator map.
                </Typography>
                <Button component={Link} to="/map" variant="outlined" size="small" endIcon={<Map />}>
                  Explore Map
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ borderRadius: 3, borderLeft: "5px solid #2e7d32" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Wellness Assessment</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Access the multi-dimensional Physical, Spiritual, Social, and Environmental assessment.
                </Typography>
                <Button component={Link} to="/wellness" variant="outlined" size="small" color="success" endIcon={<Assignment />}>
                  Open Form
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ borderRadius: 3, borderLeft: "5px solid #e65100" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Corporate Dashboard</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Open the business-oriented corporate wellness intelligence dashboard served by ASP.NET Core.
                </Typography>
                <Button href={CORPORATE_URL} target="_blank" rel="noopener noreferrer" variant="outlined" size="small" color="warning" endIcon={<Assessment />}>
                  Open Corporate UI
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

        {/* User Management Table */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", Typography: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#333" }}>
                👥 User Management & Staff Notes
              </Typography>
              <TextField
                placeholder="Search by username or email..."
                size="small"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: { xs: "100%", sm: 300 },
                  "& .MuiOutlinedInput-root": { borderRadius: 3 }
                }}
              />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                    <TableCell width="5%"></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} width="10%">ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} width="20%">Username & Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} width="20%">Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} width="30%">Staff/Admin Notes</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} align="center" width="15%">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const isExpanded = expandedUserId === user.id;
                    const report = reports[user.id];

                    return (
                      <React.Fragment key={user.id}>
                        <TableRow hover>
                          <TableCell>
                            <IconButton size="small" onClick={() => toggleExpandReport(user.id)}>
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Chip label={`#${user.id}`} size="small" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Typography sx={{ fontWeight: 600 }}>{user.username || "—"}</Typography>
                              <FormControl size="small" sx={{ minWidth: 150, mt: 0.5 }}>
                                <Select
                                  value={user.role || "USER"}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                  sx={{ borderRadius: 2, fontSize: "0.85rem" }}
                                >
                                  <MenuItem value="USER">🧘 Member</MenuItem>
                                  <MenuItem value="YOGA_INSTRUCTOR">🪷 Yoga Instructor</MenuItem>
                                  <MenuItem value="GYM_TRAINER">🏋️ Gym Trainer</MenuItem>
                                  <MenuItem value="ADMIN">⚙️ Admin</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Add professional feedback/notes..."
                                value={editingNotes[user.id] || ""}
                                onChange={(e) => handleNoteChange(user.id, e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.85rem" } }}
                              />
                              <IconButton color="primary" onClick={() => handleSaveNotes(user.id)}>
                                <Save />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                              <Button
                                variant="text"
                                color="secondary"
                                size="small"
                                startIcon={<Assessment />}
                                onClick={() => toggleExpandReport(user.id)}
                                sx={{ textTransform: "none", fontWeight: "bold" }}
                              >
                                {isExpanded ? "Hide Report" : "View Report"}
                              </Button>
                              <Button
                                color="error"
                                size="small"
                                onClick={() => handleDeleteUser(user.id)}
                                startIcon={<Delete />}
                                sx={{ textTransform: "none", fontWeight: "bold" }}
                                disabled={user.role === "ADMIN" && user.email === localStorage.getItem("email")}
                              >
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>

                        {/* Collapsible Report Row */}
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2, p: 2, bgcolor: "#fafafa", borderRadius: 3, border: "1px solid #e0e0e0" }}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 700, color: "#602e7d" }}>
                                  📋 Wellness Report Summary for {user.username}
                                </Typography>
                                {report ? (
                                  report.error ? (
                                    <Typography color="text.secondary" sx={{ py: 2 }}>
                                      No wellness report exists for this user yet. They need to fill the assessment form first.
                                    </Typography>
                                  ) : (
                                    <Grid container spacing={3} sx={{ mt: 1 }}>
                                      <Grid item xs={12} sm={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                          <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>🏃 Physical & Workout</Typography>
                                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                              {report.workoutSummary || "No data logged."}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={12} sm={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                          <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>🍏 Nutrition & Diet</Typography>
                                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                              {report.nutritionSummary || "No data logged."}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={12} sm={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                          <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>🛌 Sleep & Quality</Typography>
                                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                              {report.sleepSummary || "No data logged."}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={12} sm={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                          <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>🧠 Stress & Coping</Typography>
                                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                              {report.stressSummary || "No data logged."}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                    </Grid>
                                  )
                                ) : (
                                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                    <CircularProgress size={24} />
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography variant="body1" color="text.secondary">
                          No users found matching your search.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Corporate Partner Inquiries from .NET */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", mt: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#e65100", mb: 3 }}>
              🏢 Corporate & Studio Partner Inquiries
            </Typography>

            {inquiriesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress color="warning" />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Organization</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Contact Person</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Email & Phone</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Message / Goals</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Submitted At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inquiries.map((inq) => (
                      <TableRow key={inq.id || inq.Id} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{inq.orgName || inq.OrgName}</TableCell>
                        <TableCell>
                          <Chip
                            label={(inq.orgType || inq.OrgType).toUpperCase().replace("_", " ")}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{inq.contactName || inq.ContactName}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{inq.contactEmail || inq.ContactEmail}</Typography>
                          <Typography variant="caption" color="text.secondary">{inq.contactPhone || inq.ContactPhone}</Typography>
                        </TableCell>
                        <TableCell>{inq.city || inq.City || "—"}</TableCell>
                        <TableCell sx={{ maxWidth: 300, wordBreak: "break-word" }}>{inq.message || inq.Message || "—"}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem", color: "#666" }}>{inq.submittedAt || inq.SubmittedAt}</TableCell>
                      </TableRow>
                    ))}
                    {inquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Typography variant="body1" color="text.secondary">
                            No partnership inquiries received yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* User Feedbacks Audit Section */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", mt: 4, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#602e7d", mb: 3 }}>
              💬 User Feedbacks & Suggestions Audit
            </Typography>

            {feedbacksLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>User Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Feedback Message</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#333" }}>Submitted At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedbacks.map((fb) => (
                      <TableRow key={fb.id} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{fb.fullName || "Anonymous"}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: "#1976d2" }}>{fb.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${fb.rating || 5} ★`}
                            size="small"
                            color={(fb.rating || 5) >= 4 ? "success" : (fb.rating || 5) >= 3 ? "warning" : "error"}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={fb.category || "General"} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 350, wordBreak: "break-word" }}>{fb.message}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem", color: "#666" }}>
                          {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {feedbacks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Typography variant="body1" color="text.secondary">
                            No user feedback submitted yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminDashboard;