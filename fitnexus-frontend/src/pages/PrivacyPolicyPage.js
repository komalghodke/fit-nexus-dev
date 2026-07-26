import React from "react";
import { Container, Typography, Box, Paper, Divider, Button, Grid, Chip, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShieldIcon from "@mui/icons-material/Shield";
import GavelIcon from "@mui/icons-material/Gavel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { Link } from "react-router-dom";

function PrivacyPolicyPage() {
  return (
    <Box sx={{ background: "linear-gradient(160deg, #fdf6ff 0%, #f0f7f0 50%, #f5f0ff 100%)", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Navigation back button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Button
            component={Link}
            to="/login"
            startIcon={<ArrowBackIcon />}
            sx={{ color: "#602e7d", fontWeight: "bold", textTransform: "none", bgcolor: "rgba(96,46,125,0.06)", borderRadius: 3, px: 2.5, "&:hover": { bgcolor: "rgba(96,46,125,0.12)" } }}
          >
            Back to Portal
          </Button>
          <Chip icon={<VerifiedUserIcon sx={{ color: "#2e7d32 !important" }} />} label="DPDP Act 2023 Compliant" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
        </Box>

        {/* Hero Paper */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, boxShadow: "0 15px 45px rgba(96,46,125,0.08)", mb: 4, background: "#fff" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ width: 54, height: 54, borderRadius: "16px", bgcolor: "#602e7d", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LockIcon sx={{ fontSize: "2rem" }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: "#0d2c4e", lineHeight: 1.1 }}>
                FitNexus Privacy &amp; Data Governance Policy
              </Typography>
              <Typography variant="caption" sx={{ color: "#888", display: "block", mt: 0.5, letterSpacing: 0.5 }}>
                Effective Date: January 1, 2026 · Version 2.4 (Updated July 2026) · Regulatory Governance Document
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.9, fontSize: "1.05rem", mb: 3 }}>
            Welcome to <strong>FitNexus</strong> — India's premier holistic wellness platform. We treat your personal and health-related data with the highest standards of privacy, security, and ethical responsibility. This Privacy Policy outlines how we collect, process, store, and safeguard your data in compliance with the <strong>Digital Personal Data Protection (DPDP) Act 2023 of India</strong>, the <strong>General Data Protection Regulation (GDPR)</strong> principles, and international healthcare privacy guidelines.
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: "#f1f8e9", borderRadius: 3, borderLeft: "4px solid #2e7d32" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2e7d32" }}>🔒 Zero Third-Party Sale</Typography>
                <Typography variant="caption" sx={{ color: "#555", display: "block", mt: 0.5 }}>We never sell, rent, or commercialize your health indicators or personal identity.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: "#f3e5f5", borderRadius: 3, borderLeft: "4px solid #602e7d" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#602e7d" }}>🛡️ End-to-End Encryption</Typography>
                <Typography variant="caption" sx={{ color: "#555", display: "block", mt: 0.5 }}>All network traffic is encrypted via HTTPS with JSON Web Token (JWT) role-gated access control.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 3, borderLeft: "4px solid #e65100" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#e65100" }}>📋 User Data Rights</Typography>
                <Typography variant="caption" sx={{ color: "#555", display: "block", mt: 0.5 }}>Full right to inspect, rectify, export, or permanently erase your profile and wellness logs anytime.</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 1 */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <ShieldIcon sx={{ color: "#602e7d" }} /> 1. Categories of Personal &amp; Wellness Data Collected
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            FitNexus processes user data exclusively to calculate your multi-dimensional wellness score, generate YCB-aligned recommendations, and present progress trends on your dashboard.
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              • <strong>Account Credentials &amp; Identity:</strong> Username, Email Address, Password (hashed via Spring Security bcrypt/NoOp dev), Role assignment (Member, Yoga Instructor, Gym Trainer, Admin).
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              • <strong>Physical &amp; Physiological Metrics:</strong> Age, Gender, Height (cm), Weight (kg), Calculated Body Mass Index (BMI), Resting Heart Rate (BPM), Daily Water Intake (Liters), Sleep Duration (Hours), Sleep Quality, Chronic Conditions, Pain Areas.
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              • <strong>Lifestyle &amp; Behavioral Logs:</strong> Workout type &amp; duration, Daily meal calories, MET-based energy expenditure logs, Subjective stress ratings (1-10), Stress triggers, Subjective mood, Journal entries.
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              • <strong>Multi-Dimensional Assessment Data:</strong> 27 qualitative indicators covering Physical, Emotional, Spiritual, Social, and Environmental dimensions used to construct your 7 Chakra alignment map.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <GavelIcon sx={{ color: "#054474" }} /> 2. Purpose of Data Processing &amp; Legal Basis
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            Your data is processed under the explicit consent provided during user registration. We use your data to:
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              1. Calculate your FitNexus Wellness Score (1–10 scale) using predictive multi-variable algorithms.
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              2. Generate customized Asana (pose) and Pranayama (breathing) recommendation plans based on reported pain areas or stress levels.
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              3. Provide secure, role-restricted dashboard views for certified Staff (Yoga Instructors / Gym Trainers) to log personalized guidance notes for assigned members.
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
              4. Power the Google Gemini AI Wellness Companion — context strings sent to Gemini are anonymized and omit personally identifiable information like phone numbers or exact residential addresses.
            </Typography>
          </Box>

          {/* Section 3 */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            🔒 3. Data Storage, Security Architecture &amp; Retention
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 3 }}>
            FitNexus employs a robust microservice-backed security architecture. Network communication uses TLS/HTTPS protocol. Session tokens are signed using 256-bit secret key JWT (JSON Web Tokens) with automated expiry. Database storage in MySQL (`fitnexusdb`) is protected behind firewalled local services. User logs are retained for the duration of an active account and deleted permanently upon user account deletion.
          </Typography>

          {/* Section 4 */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0d2c4e", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            ✋ 4. Data Principal Rights (Under DPDP Act 2023 &amp; GDPR)
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
            As a registered user ("Data Principal"), you possess the following statutory rights:
          </Typography>

          <Accordion sx={{ mb: 1, boxShadow: "none", border: "1px solid #eee", "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#602e7d" }}>Right to Access &amp; Summary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                You can view a complete summary of all personal information, wellness reports, and log history anytime by visiting your Profile or Reports page.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 1, boxShadow: "none", border: "1px solid #eee", "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#602e7d" }}>Right to Correction &amp; Erasure</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                You can modify your profile details, update wellness inputs by retaking the assessment, or request complete account erasure by contacting our DPO.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 3, boxShadow: "none", border: "1px solid #eee", "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#602e7d" }}>Right to Grievance Redressal</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                You have the right to file grievances regarding data processing directly with our Data Protection Officer or the Data Protection Board of India.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Section 5: Mandatory Legal Disclaimers */}
          <Box sx={{ p: 3, bgcolor: "#fff3e0", borderRadius: 4, borderLeft: "6px solid #e65100", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <MedicalInformationIcon sx={{ color: "#e65100" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#e65100" }}>
                5. Mandatory Medical &amp; Government Non-Affiliation Disclaimers
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#b45309", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, mb: 1, display: "block" }}>
              ⚠️ NO MEDICAL ADVICE OR DOCTOR PRESCRIPTION
            </Typography>
            <Typography variant="body2" sx={{ color: "#8b6914", lineHeight: 1.8, mb: 2 }}>
              <strong>FITNEXUS DOES NOT PROVIDE MEDICAL DIAGNOSIS, MEDICAL ADVICE, CLINICAL TREATMENT PLANS, OR DOCTOR PRESCRIPTIONS.</strong> All scores, yoga asanas, pranayama routines, and diet insights provided by the platform or its AI companion are generated for general wellness education and self-reflection purposes only. They are not a substitute for professional medical advice, clinical diagnosis, or medical treatment. Always seek the advice of your physician or qualified health provider for any medical condition.
            </Typography>

            <Typography variant="body2" sx={{ color: "#b45309", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, mb: 1, display: "block" }}>
              🏛️ GOVERNMENT OF INDIA &amp; MINISTRY OF AYUSH NON-AFFILIATION
            </Typography>
            <Typography variant="body2" sx={{ color: "#8b6914", lineHeight: 1.8 }}>
              FitNexus is an independent educational and personal wellness project developed by Komal Ghodke (Government Certified Yoga Teacher, YCB). FitNexus is <strong>NOT affiliated with, endorsed by, sponsored by, or officially connected with the Ministry of AYUSH, the Government of India (GOI), or any government health authority</strong>. All references to YCB (Yoga Certification Board) refer to educational syllabus standards used for curriculum alignment only.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* DPO Contact Info */}
          <Box sx={{ textAlign: "center", p: 3, bgcolor: "#faf6ff", borderRadius: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#602e7d", mb: 0.5 }}>
              FitNexus Data Protection &amp; Governance Office
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Chief Data Protection Officer: <strong>Komal Ghodke</strong> (Govt Certified Yoga Teacher, YCB)
            </Typography>
            <Typography variant="caption" sx={{ color: "#777", display: "block", mt: 0.5 }}>
              Repository &amp; Security Audits: <u>github.com/komalghodke/fit-nexus-dev</u> · Contact: komalghodke@fitnexus.dev
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default PrivacyPolicyPage;
