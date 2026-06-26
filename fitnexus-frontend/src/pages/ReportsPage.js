import React, { useEffect, useState } from "react";
import { fetchReport } from "../api/reportsApi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  Bedtime,
  Psychology,
  AssignmentTurnedIn,
  Print,
  Spa
} from "@mui/icons-material";

function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await fetchReport(userId);
        setReport(data);
      } catch (err) {
        console.error("Error fetching report", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          No report data found. Please complete the Wellness Assessment form first.
        </Typography>
        <Button variant="contained" href="/wellness" sx={{ mt: 3, bgcolor: "#2e7d32" }}>
          Go to Assessment
        </Button>
      </Container>
    );
  }

  // Calculate a mock score from inputs or recommendations
  // Fewer warnings/recommendations means better health score!
  const recommendationsCount = report.recommendations?.length || 0;
  const scoreVal = Math.max(2, 10 - Math.floor(recommendationsCount / 1.5));
  
  // Recharts Gauge Data
  const chartData = [
    { name: "Score", value: scoreVal },
    { name: "Remaining", value: 10 - scoreVal }
  ];
  
  const COLORS = ["#2e7d32", "#eeeeee"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Printable CSS Hook */}
      <style>
        {`
          @media print {
            header, nav, button, footer {
              display: none !important;
            }
            body {
              background: white;
              color: black;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Header with PDF Print Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#1b5e20" }}>
            🌿 Your Wellness Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Holistic report and personalized AYUSH recommendations
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handlePrint}
          startIcon={<Print />}
          className="no-print"
          sx={{
            bgcolor: "#2e7d32",
            fontWeight: "bold",
            borderRadius: 3,
            px: 3,
            py: 1,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#1b5e20"
            }
          }}
        >
          Print / Save PDF
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Score & Core Recommendations */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "100%", textAlign: "center", py: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#555" }}>
                Overall Wellness Score
              </Typography>
              
              {/* Semi-Circle Gauge representation */}
              <Box sx={{ width: "100%", height: 180, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="70%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={70}
                      outerRadius={95}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#2e7d32" }}>
                    {scoreVal}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scoreVal >= 8 ? "Excellent" : scoreVal >= 6 ? "Moderate" : "Needs Restorative Care"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" sx={{ fontStyle: "italic", color: "#555", px: 2 }}>
                "Svasthasya svasthya rakshanam, aturasya vikara prashamanam cha."<br />
                <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
                  (To protect the health of the healthy and cure the disorders of the diseased.)
                </Typography>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Log Summaries cards */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            {/* Workout Summary */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", height: "100%", borderLeft: "5px solid #2e7d32" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <FitnessCenter sx={{ color: "#2e7d32" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Workout Summary</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {report.workoutSummary || "No workout logs recorded."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Nutrition Summary */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", height: "100%", borderLeft: "5px solid #e65100" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Restaurant sx={{ color: "#e65100" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Nutrition Summary</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {report.nutritionSummary || "No nutrition logs recorded."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Sleep Summary */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", height: "100%", borderLeft: "5px solid #1565c0" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Bedtime sx={{ color: "#1565c0" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Sleep Summary</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {report.sleepSummary || "No sleep logs recorded."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Stress Summary */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", height: "100%", borderLeft: "5px solid #c2185b" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Psychology sx={{ color: "#c2185b" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Stress Summary</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {report.stressSummary || "No stress logs recorded."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Actionable Guidelines and Recommendations */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 6px 15px rgba(0,0,0,0.05)", mt: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Spa sx={{ color: "#2e7d32", fontSize: "2rem" }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1b5e20" }}>
                  AYUSH Guidelines & Recommendations
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {report.recommendations && report.recommendations.length > 0 ? (
                <List>
                  {report.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ py: 1.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <AssignmentTurnedIn sx={{ color: "#2e7d32" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={rec}
                        primaryTypographyProps={{ variant: "body1", fontWeight: "medium" }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No immediate adjustments needed. Your answers reflect strong, balanced wellness indicators.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ReportsPage;
