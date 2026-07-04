import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Container, Divider, Grid } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 0,
        background: "linear-gradient(90deg, #0d2c4e 0%, #255f9a 45%, #602e7d 100%)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 -4px 20px rgba(96,46,125,0.25)",
        pt: 4,
        pb: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 3 }}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <SpaIcon sx={{ color: "#b39ddb", fontSize: "1.6rem" }} />
              <Typography variant="h6" sx={{ fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
                FitNexus
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 280 }}>
              An AI-powered holistic wellness platform inspired by the 6 Dimensions of Wellness
              and the Yoga Certification Board (YCB) principles.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="caption" sx={{ color: "#b39ddb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              Platform
            </Typography>
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/wellness",  label: "Assessment" },
              { to: "/reports",   label: "Reports" },
              { to: "/profile",   label: "Profile" }
            ].map(({ to, label }) => (
              <Box key={to} sx={{ mt: 1 }}>
                <Typography
                  component={Link}
                  to={to}
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", "&:hover": { color: "#fff" } }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* Wellness Dimensions */}
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ color: "#b39ddb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              6 Wellness Dimensions
            </Typography>
            {["Physical 🏃", "Emotional 💚", "Spiritual 🧘", "Social 🤝", "Occupational 💼", "Environmental 🌿"].map((d) => (
              <Box key={d} sx={{ mt: 0.8 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>
                  {d}
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* AYUSH Disclaimer */}
          <Grid item xs={12} md={3}>
            <Typography variant="caption" sx={{ color: "#b39ddb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              Disclaimer
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)", mt: 1, lineHeight: 1.65, fontSize: "0.78rem" }}>
              FitNexus is an independent academic project inspired by Yoga Certification Board (YCB)
              wellness principles under the Ministry of AYUSH. It is <strong style={{ color: "rgba(255,255,255,0.75)" }}>not affiliated</strong> with
              or endorsed by the Ministry of AYUSH, Government of India.
              Always consult a qualified healthcare professional before beginning any wellness program.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} FitNexus · Built with ❤️ for Holistic Wellness · All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
            Stack: React · Spring Boot · MySQL · JWT · Material UI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;