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
import { Bedtime } from "@mui/icons-material";

function SleepForm() {
  const [sleep, setSleep] = useState({ hours: "", quality: "Good" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setSleep({ ...sleep, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!sleep.hours) {
      setError("Please fill out hours slept");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/sleep/${userId}`, {
        hours: parseInt(sleep.hours),
        quality: sleep.quality
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Sleep logged successfully!");
      setSleep({ hours: "", quality: "Good" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to log sleep. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ px: 4, py: 5 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Bedtime sx={{ fontSize: "3rem", color: "#1565c0", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1565c0" }}>
              Log Sleep
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record daily hours of rest and sleep quality indicators
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Hours Slept"
                name="hours"
                type="number"
                value={sleep.hours}
                onChange={handleChange}
              />

              <FormControl fullWidth>
                <InputLabel>Quality</InputLabel>
                <Select
                  name="quality"
                  value={sleep.quality}
                  label="Quality"
                  onChange={handleChange}
                >
                  <MenuItem value="Restful">Restful</MenuItem>
                  <MenuItem value="Interrupted">Interrupted</MenuItem>
                  <MenuItem value="Insomnia">Insomnia</MenuItem>
                  <MenuItem value="LightSleep">Light Sleep</MenuItem>
                  <MenuItem value="Oversleeping">Oversleeping</MenuItem>
                  <MenuItem value="DreamDisturbed">Dream Disturbed</MenuItem>
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
                  bgcolor: "#1565c0",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#0d47a1"
                  }
                }}
              >
                {loading ? "Saving..." : "Save Sleep"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SleepForm;
