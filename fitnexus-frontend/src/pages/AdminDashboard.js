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
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  SupervisorAccount,
  People,
  Assignment,
  Search,
  Delete,
  Security
} from "@mui/icons-material";

const API = "http://localhost:8080";

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/users`, { headers }),
        axios.get(`${API}/api/users/stats`, { headers })
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
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
        `${API}/api/users/${userId}/role?role=${newRole}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("User role updated successfully!");
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      // Refresh stats
      const statsRes = await axios.get(`${API}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("User deleted successfully!");
      setUsers(prev => prev.filter(u => u.id !== userId));
      // Refresh stats
      const statsRes = await axios.get(`${API}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to delete user.");
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
    { label: "Total Assessments", count: stats.totalAssessments, color: "#e65100", bg: "#fff3e0", icon: <Assignment /> }
  ];

  return (
    <Box sx={{ minHeight: "92vh", background: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
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
                  ⚙️ Admin Portal
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Manage system users, view system statistics, and configure staff access.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statItems.map((item, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
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

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

        {/* User Management Table */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#333" }}>
                👥 User Management
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
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#333" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell><Chip label={`#${user.id}`} size="small" /></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{user.username || "—"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <Select
                            value={user.role || "USER"}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="USER">🧘 Member</MenuItem>
                            <MenuItem value="YOGA_INSTRUCTOR">🪷 Yoga Instructor</MenuItem>
                            <MenuItem value="GYM_TRAINER">🏋️ Gym Trainer</MenuItem>
                            <MenuItem value="ADMIN">⚙️ Admin</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          startIcon={<Delete />}
                          sx={{ textTransform: "none", fontWeight: "bold" }}
                          disabled={user.role === "ADMIN" && user.email === localStorage.getItem("email")} // Don't self-delete
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
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
      </Container>
    </Box>
  );
}

export default AdminDashboard;
