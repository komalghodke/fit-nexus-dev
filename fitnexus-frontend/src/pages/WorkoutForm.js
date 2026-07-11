import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import { FitnessCenter } from "@mui/icons-material";

function WorkoutForm() {
  const [workout, setWorkout] = useState({ type: "", duration: "", intensity: "Medium" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setWorkout({ ...workout, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!workout.type || !workout.duration) {
      setError("Please fill in workout type and duration");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/workout/${userId}`, {
        type: workout.type,
        duration: parseInt(workout.duration),
        intensity: workout.intensity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Workout logged successfully!");
      setWorkout({ type: "", duration: "", intensity: "Medium" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to log workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ px: 4, py: 5 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <FitnessCenter sx={{ fontSize: "3rem", color: "#2e7d32", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1b5e20" }}>
              Log Workout
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record physical exercises or yoga routines
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Workout Type (e.g. Yoga, Gym, Running)"
                name="type"
                value={workout.type}
                onChange={handleChange}
              />

              <TextField
                required
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={workout.duration}
                onChange={handleChange}
              />

              <FormControl fullWidth>
                <InputLabel>Intensity</InputLabel>
                <Select
                  name="intensity"
                  value={workout.intensity}
                  label="Intensity"
                  onChange={handleChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: "#2e7d32",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#1b5e20"
                  }
                }}
              >
                {loading ? "Saving..." : "Save Workout"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default WorkoutForm;
