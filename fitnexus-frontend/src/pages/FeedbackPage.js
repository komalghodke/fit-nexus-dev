import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../api/apiConfig";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FeedbackIcon from "@mui/icons-material/Feedback";

export default function FeedbackPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("General Feedback");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo(null);

    // Email validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!email || !emailRegex.test(email)) {
      setAlertInfo({ severity: "error", message: "Please enter a valid mandatory email address." });
      return;
    }

    if (!message.trim()) {
      setAlertInfo({ severity: "error", message: "Please provide a feedback message." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_URL}/feedback`, {
        fullName: fullName || "Anonymous User",
        email,
        rating,
        category,
        message
      }, { headers });

      if (res.data && res.data.success) {
        setAlertInfo({ severity: "success", message: res.data.message || "Feedback submitted successfully!" });
        setFullName("");
        setEmail("");
        setRating(5);
        setCategory("General Feedback");
        setMessage("");
      } else {
        setAlertInfo({ severity: "error", message: res.data?.message || "Failed to submit feedback." });
      }
    } catch (err) {
      setAlertInfo({
        severity: "error",
        message: err.response?.data?.message || "Error connecting to server. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <FeedbackIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h4" fontWeight="700" color="primary">
              FitNexus Feedback & Suggestions
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your experience matters to us! Share your thoughts, report issues, or suggest new wellness features to help us improve the platform.
          </Typography>

          {alertInfo && (
            <Alert severity={alertInfo.severity} sx={{ mb: 3 }} onClose={() => setAlertInfo(null)}>
              {alertInfo.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name (Optional)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address (Mandatory)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  helperText="Valid email is required to process feedback."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Feedback Category</InputLabel>
                  <Select
                    value={category}
                    label="Feedback Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="General Feedback">General Feedback</MenuItem>
                    <MenuItem value="AI Chatbot & Wellness Insights">AI Chatbot & Wellness Insights</MenuItem>
                    <MenuItem value="User Interface & Experience">User Interface & Experience</MenuItem>
                    <MenuItem value="Yoga & Asana Recommendations">Yoga & Asana Recommendations</MenuItem>
                    <MenuItem value="Bug Report / Technical Issue">Bug Report / Technical Issue</MenuItem>
                    <MenuItem value="Feature Request">Feature Request</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box border="1px solid #ddd" borderRadius={1} p={1.5} display="flex" flexDirection="column" justifyContent="center">
                  <Typography component="legend" variant="body2" color="text.secondary">
                    Rate Your Experience
                  </Typography>
                  <Rating
                    name="feedback-rating"
                    value={rating}
                    precision={1}
                    onChange={(event, newValue) => setRating(newValue || 5)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Your Feedback / Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you loved or what we can refine..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ borderRadius: 2, px: 4, py: 1.2, fontWeight: 700 }}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
