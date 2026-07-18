import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Divider, Alert, Button } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import HealingIcon from "@mui/icons-material/Healing";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <Box sx={{ background: "linear-gradient(135deg, #fdf6ff 0%, #ede7f6 100%)", minHeight: "90vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Back button */}
        <Button
          component={Link}
          to="/login"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: "#602e7d", fontWeight: "bold", textTransform: "none" }}
        >
          Back to Login
        </Button>

        {/* Hero Section */}
        <Box sx={{ textCenter: "center", mb: 6, textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mb: 2 }}>
            <SpaIcon sx={{ color: "#602e7d", fontSize: "3.5rem" }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#0d2c4e", letterSpacing: -0.5 }}>
              About FitNexus
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: "#555", maxWidth: "800px", mx: "auto", fontWeight: 500, lineHeight: 1.6 }}>
            A structured, multilingual, rule-based wellness engine that blends yogic wisdom with modern software architecture to support preventive health and emotional reflection.
          </Typography>
        </Box>

        {/* Important Disclaimer Banner */}
        <Alert
          severity="warning"
          icon={<HealingIcon />}
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 6,
            boxShadow: "0 10px 30px rgba(230,81,0,0.1)",
            border: "1px solid #ffe082",
            "& .MuiAlert-message": { width: "100%" }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#e65100", mb: 0.5 }}>
            ⚠️ CRITICAL MEDICAL DISCLAIMER
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7 }}>
            FitNexus is **NOT** a diagnosis tool, does **NOT** provide medical advice, and is **NOT** run by doctors.
            It is designed strictly to support general preventive wellness. If you have any medical condition or disease,
            you must consult a qualified medical doctor or healthcare professional. Do not start any fitness or yoga program
            without proper medical clearance.
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          {/* Column 1: Platform Vision */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 5, height: "100%", boxShadow: "0 15px 40px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <SelfImprovementIcon sx={{ color: "#602e7d", fontSize: "2rem" }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e" }}>
                    Yogic Wisdom & YCB Alignment
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
                  Inspired by the values and standards outlined in the **Yoga Certification Board (YCB)** syllabus under the **Ministry of AYUSH**, FitNexus honors the principles of holistic health. By checking **27 distinct health indicators**, the platform evaluates wellness across physical, mental, spiritual, social, occupational, and environmental levels.
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8 }}>
                  Our lifestyle recommendations, breathing exercises, and meditation strategies are mapped out according to these traditional yogic standards, allowing you to reflect on your state of balance and proceed with mindfulness.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Column 2: Legal Status */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 5, height: "100%", boxShadow: "0 15px 40px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <DeveloperModeIcon sx={{ color: "#054474", fontSize: "2rem" }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e" }}>
                    Independent & Individual Project
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
                  Please note that FitNexus is an **independent academic project** developed individually. It is **NOT** affiliated with, endorsed by, or representing the Ministry of AYUSH, the Government of India, or any governmental agency.
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8 }}>
                  Our objective is to demonstrate how a rule-based engine and modern architecture can support wellness visualization. All recommendations are rule-driven templates and should never replace professional medical judgment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Key Features Details */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 3, textAlign: "center" }}>
            The 6 Pillars of Wellness
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: "🏃 Physical", desc: "Track workouts, BMI, resting heart rate, water intake, and daily logs." },
              { title: "🧠 Emotional", desc: "Observe mood, energy shifts, and stress scores with breathing recommendations." },
              { title: "🧘 Spiritual", desc: "Evaluate inner peace and align with personalized Chakra insights." },
              { title: "🤝 Social", desc: "Acknowledge supportive social circles and outer relationships." },
              { title: "💼 Occupational", desc: "Assess work satisfaction and occupational fatigue levels." },
              { title: "🌿 Environmental", desc: "Track hours spent in nature to cultivate ecological harmony." }
            ].map((pillar) => (
              <Grid item xs={12} sm={6} md={4} key={pillar.title}>
                <Card sx={{ borderRadius: 3, border: "1px solid #ede7f6", height: "100%", bgcolor: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#602e7d", mb: 1 }}>
                      {pillar.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.5 }}>
                      {pillar.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6, borderColor: "rgba(0,0,0,0.08)" }} />

        {/* Footer note */}
        <Box sx={{ textAlign: "center", color: "#666" }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 1 }}>
            <LockIcon sx={{ fontSize: "1rem", color: "#888" }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Your Data is Encrypted & Secure
            </Typography>
          </Box>
          <Typography variant="caption" display="block">
            FitNexus honors individual privacy. Your wellness logs and reports are strictly kept under secure JWT authenticated storage.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default AboutPage;
