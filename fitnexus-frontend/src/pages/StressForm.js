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
  Slider,
  Alert
} from "@mui/material";
import { Psychology } from "@mui/icons-material";

function StressForm() {
  const [stress, setStress] = useState({ level: 5, notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setStress({ ...stress, [e.target.name]: e.target.value });
  const handleSliderChange = (e, val) => setStress({ ...stress, level: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/stress/${userId}`, {
        level: stress.level,
        notes: stress.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Stress entry logged successfully!");
      setStress({ level: 5, notes: "" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to log stress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ px: 4, py: 5 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Psychology sx={{ fontSize: "3rem", color: "#c2185b", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#c2185b" }}>
              Log Stress Level
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record daily mental/emotional pressure and stress triggers
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography gutterBottom color="text.secondary">
                  Stress Level (1 = Calm, 10 = Severe)
                </Typography>
                <Slider
                  value={stress.level}
                  onChange={handleSliderChange}
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  marks
                  color="secondary"
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Triggers / Notes (e.g., tight deadline, poor sleep)"
                name="notes"
                value={stress.notes}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: "#c2185b",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#880e4f"
                  }
                }}
              >
                {loading ? "Saving..." : "Save Entry"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default StressForm;
