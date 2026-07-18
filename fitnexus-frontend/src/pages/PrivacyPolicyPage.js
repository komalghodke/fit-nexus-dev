import React from "react";
import { Container, Typography, Box, Paper, Divider, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

function PrivacyPolicyPage() {
  return (
    <Box sx={{ background: "linear-gradient(135deg, #fdf6ff 0%, #ede7f6 100%)", minHeight: "90vh", py: 6 }}>
      <Container maxWidth="md">
        {/* Back button */}
        <Button
          component={Link}
          to="/login"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: "#602e7d", fontWeight: "bold", textTransform: "none" }}
        >
          Back to Login
        </Button>

        <Paper sx={{ p: 4, borderRadius: 5, boxShadow: "0 15px 40px rgba(0,0,0,0.05)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <LockIcon sx={{ color: "#602e7d", fontSize: "2.5rem" }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: "#0d2c4e" }}>
              Privacy Policy
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 3 }}>
            Effective Date: January 1, 2026 | Last Updated: July 2026
          </Typography>

          <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.8, mb: 3 }}>
            Welcome to FitNexus. We value your privacy and are committed to protecting your personal and health-related data. This Privacy Policy outlines how we collect, use, store, and protect your information when you use our web platform.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7, mb: 2 }}>
            To provide personalized wellness insights, we collect the following types of information:
            <ul>
              <li><strong>Profile Information:</strong> Name, Email, Age, Gender, City, and Password (securely encrypted).</li>
              <li><strong>Wellness Logs:</strong> Everyday metrics regarding physical activity, nutrition intake, sleep parameters, and subjective stress levels.</li>
              <li><strong>Wellness Assessment Responses:</strong> Your multi-dimensional answers on physical, emotional, spiritual, social, and environmental indicators to generate the report.</li>
            </ul>
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7, mb: 2 }}>
            Your data is used strictly for the following purposes:
            <ul>
              <li>To calculate and visualize your multidimensional wellness scores.</li>
              <li>To offer rule-based holistic and lifestyle guidelines based on traditional YCB concepts.</li>
              <li>To enable secure logs history for your personal reflection and dashboard.</li>
              <li>To allow staff (Yoga Instructors or Gym Trainers) to view reports and suggest recommendations only if they are assigned to review them.</li>
            </ul>
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1 }}>
            3. Data Sharing & Security
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7, mb: 2 }}>
            We implement high-grade JWT tokens and industry-standard security protocols to encrypt and restrict access to your information. We do **not** sell, rent, or distribute your personal or medical data to third parties. Access to reports is strictly gated by role-based authentication.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1 }}>
            4. User Rights & Data Control
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7, mb: 2 }}>
            You maintain full control of your data. You may modify your profile details, delete specific daily logs, or retake the wellness assessment to reset your wellness score.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1 }}>
            5. Legal Disclaimer
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7, mb: 2 }}>
            FitNexus is a personal academic demonstration project and is not a clinical application. We do not guarantee medical outcomes. Please consult a primary physician for any clinical diagnosis or medical condition therapy.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" sx={{ color: "#666", textAlign: "center", fontStyle: "italic" }}>
            For privacy concerns or inquiry, please reach out to the project administrator.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default PrivacyPolicyPage;
