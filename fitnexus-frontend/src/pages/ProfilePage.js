import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api/apiConfig";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Container,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import { AccountCircle, Settings } from "@mui/icons-material";

function ProfilePage() {
  const [profile, setProfile] = useState({ username: "", email: "", password: "" });
  const [wellness, setWellness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const emailStored = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !emailStored) {
      navigate("/login");
      return;
    }

    async function loadData() {
      try {
        // Fetch User Account Profile
        const userRes = await axios.get(`${API_URL}/users/profile/${emailStored}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          username: userRes.data.username,
          email: userRes.data.email,
          password: "" // Keep password hidden/empty by default
        });

        // Fetch physical wellness inputs if they exist
        try {
          const wellnessRes = await axios.get(`${API_URL}/wellness-input/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWellness(wellnessRes.data);
        } catch (wErr) {
          // Wellness input may not exist yet, ignore
          setWellness(null);
        }
      } catch (err) {
        setError("Session expired or failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, emailStored, userId, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile.username) {
      setError("Username cannot be empty");
      return;
    }

    try {
      await axios.put(`${API_URL}/users/profile/${emailStored}`, {
        username: profile.username,
        password: profile.password // Backend updates password if provided
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Account updated successfully!");
    } catch (err) {
      setError("Failed to update profile settings.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "rgb(114, 76, 175)", mb: 5 }}>
        👤 Profile Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Account Info & Wellness Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", mb: 4, textAlign: "center", py: 4, background: "linear-gradient(135deg, #ffffff, #f5f7fa)" }}>
            <CardContent>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "rgb(114, 76, 175)", mx: "auto", mb: 2 }}>
                <AccountCircle sx={{ fontSize: "3.5rem" }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {profile.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {profile.email}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: "bold" }}
              >
                Log Out Account
              </Button>
            </CardContent>
          </Card>

          {wellness && (
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", background: "linear-gradient(135deg, #ffffff, #f5f7fa)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "rgb(114, 76, 175)", mb: 2 }}>
                  📏 Physical Stats (Form Inputs)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Age</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{wellness.age} years</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Gender</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{wellness.gender}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Height</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{wellness.height} cm</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Weight</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{wellness.weight} kg</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">BMI</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{wellness.bmi ? wellness.bmi.toFixed(1) : "22.5"}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">City</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{wellness.city}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Side: Account credentials update */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "100%", background: "linear-gradient(135deg, #ffffff, #f5f7fa)" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Settings sx={{ color: "rgb(114, 76, 175)" }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Account Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

              <form onSubmit={handleUpdate}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    label="Username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    fullWidth
                    disabled
                    helperText="Email address cannot be changed."
                  />

                  <TextField
                    label="New Password (optional)"
                    name="password"
                    type="password"
                    placeholder="Enter new password to change"
                    value={profile.password}
                    onChange={handleChange}
                    fullWidth
                    helperText="Leave empty if you don't want to change password."
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      textTransform: "none",
                      background: "linear-gradient(90deg, #3498db, rgb(114, 76, 175))",
                      boxShadow: "0 4px 14px rgba(114, 76, 175, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #2980b9, #5a3a9d)"
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfilePage;