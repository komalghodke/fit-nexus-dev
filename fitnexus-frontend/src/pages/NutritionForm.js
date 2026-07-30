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
  Alert
} from "@mui/material";
import { Restaurant } from "@mui/icons-material";

function NutritionForm() {
  const [meal, setMeal] = useState({ meal: "", calories: "", notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => setMeal({ ...meal, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!meal.meal || !meal.calories) {
      setError("Please fill out meal item and calorie counts");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/nutrition/${userId}`, {
        meal: meal.meal,
        calories: parseInt(meal.calories),
        notes: meal.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Meal logged successfully!");
      setMeal({ meal: "", calories: "", notes: "" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to log meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ px: 4, py: 5 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Restaurant sx={{ fontSize: "3rem", color: "#e65100", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#e65100" }}>
              Log Nutrition
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record meals, calorie estimates, and nutritional details
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Meal / Food Item"
                name="meal"
                value={meal.meal}
                onChange={handleChange}
              />

              <TextField
                required
                fullWidth
                label="Calories (kcal)"
                name="calories"
                type="number"
                value={meal.calories}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Notes (e.g. 30g protein, organic)"
                name="notes"
                value={meal.notes}
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
                  bgcolor: "#e65100",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#b73e00"
                  }
                }}
              >
                {loading ? "Saving..." : "Save Meal"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default NutritionForm;
