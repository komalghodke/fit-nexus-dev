import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CORPORATE_URL } from "../api/apiConfig";
import { useTranslation } from "react-i18next";
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Chip, IconButton, Tooltip
} from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// TranslateIcon removed (unused)

const LANGS = [
  { code: "en",  label: "EN" },
  { code: "hi",  label: "हिं" },
  { code: "mr",  label: "मरा" }
];

function Navbar() {
  const token    = localStorage.getItem("token");
  const role     = localStorage.getItem("role") || "USER";
  const location = useLocation();
  const { i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navBtn = (path) => ({
    color: isActive(path) ? "#fff" : "rgba(255,255,255,0.8)",
    fontWeight: isActive(path) ? 800 : 500,
    backgroundColor: isActive(path) ? "rgba(255,255,255,0.18)" : "transparent",
    borderRadius: 2,
    mx: 0.3,
    px: 1.8,
    textTransform: "none",
    fontSize: "0.92rem",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.14)",
      color: "#fff"
    }
  });

  const isStaff = role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER" || role === "ADMIN";

  const roleChip = () => {
    if (role === "YOGA_INSTRUCTOR")
      return { label: "🪷 Yoga Instructor", color: "#b39ddb" };
    if (role === "GYM_TRAINER")
      return { label: "🏋️ Gym Trainer", color: "#80cbc4" };
    if (role === "ADMIN")
      return { label: "⚙️ Admin", color: "#ef9a9a" };
    return null;
  };
  const chip = roleChip();

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #0d2c4e 0%, #255f9a 45%, #602e7d 100%)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 16px rgba(96,46,125,0.35)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: "68px", px: 0, gap: 1 }}>

          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <SpaIcon sx={{ mr: 0.8, fontSize: "1.7rem", color: "#b39ddb" }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={token ? (role === "ADMIN" ? "/admin" : isStaff ? "/staff" : "/dashboard") : "/login"}
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.5px",
                textDecoration: "none",
                color: "#fff",
                fontSize: "1.35rem"
              }}
            >
              FitNexus
            </Typography>
            {chip && (
              <Chip
                label={chip.label}
                size="small"
                sx={{
                  ml: 1.5,
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: chip.color,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                  border: `1px solid ${chip.color}55`
                }}
              />
            )}
          </Box>

          {/* Nav Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
            <Button component={Link} to="/about" sx={navBtn("/about")}>About</Button>
            {token ? (
              <>
                {role === "ADMIN" ? (
                  /* Admin navigation */
                  <>
                    <Button component={Link} to="/admin" sx={navBtn("/admin")}>Admin Panel</Button>
                    <Button component={Link} to="/staff" sx={navBtn("/staff")}>Staff Console</Button>
                    <Button component={Link} to="/map" sx={navBtn("/map")}>Map</Button>
                    <Button component={Link} to="/feedback" sx={navBtn("/feedback")}>Feedback</Button>
                    <Button href={CORPORATE_URL} target="_blank" rel="noopener noreferrer" sx={navBtn("")}>Corporate</Button>
                  </>
                ) : role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER" ? (
                  /* Staff navigation */
                  <>
                    <Button component={Link} to="/staff" sx={navBtn("/staff")}>
                      {role === "YOGA_INSTRUCTOR" ? <SelfImprovementIcon sx={{ mr: 0.5, fontSize: 18 }} /> : <FitnessCenterIcon sx={{ mr: 0.5, fontSize: 18 }} />}
                      Console
                    </Button>
                    <Button component={Link} to="/map" sx={navBtn("/map")}>Map</Button>
                    <Button component={Link} to="/feedback" sx={navBtn("/feedback")}>Feedback</Button>
                    <Button href={CORPORATE_URL} target="_blank" rel="noopener noreferrer" sx={navBtn("")}>Corporate</Button>
                  </>
                ) : (
                  /* Member navigation */
                  <>
                    <Button component={Link} to="/dashboard" sx={navBtn("/dashboard")}>Dashboard</Button>
                    <Button component={Link} to="/wellness"  sx={navBtn("/wellness")}>Assessment</Button>
                    <Button component={Link} to="/reports"   sx={navBtn("/reports")}>Reports</Button>
                    <Button component={Link} to="/profile"   sx={navBtn("/profile")}>Profile</Button>
                    <Button component={Link} to="/map"       sx={navBtn("/map")}>Map</Button>
                    <Button component={Link} to="/feedback"  sx={navBtn("/feedback")}>Feedback</Button>
                    <Button href={CORPORATE_URL} target="_blank" rel="noopener noreferrer" sx={navBtn("")}>Corporate</Button>
                  </>
                )}

                {/* Language Switcher */}
                <Box sx={{ display: "flex", ml: 1, gap: 0.4 }}>
                  {LANGS.map(({ code, label }) => (
                    <Tooltip key={code} title={`Switch to ${code.toUpperCase()}`} arrow>
                      <IconButton
                        size="small"
                        onClick={() => i18n.changeLanguage(code)}
                        sx={{
                          color: i18n.language === code ? "#fff" : "rgba(255,255,255,0.5)",
                          bgcolor: i18n.language === code ? "rgba(255,255,255,0.18)" : "transparent",
                          borderRadius: 1.5,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          width: 30,
                          height: 26,
                          "&:hover": { bgcolor: "rgba(255,255,255,0.12)" }
                        }}
                      >
                        {label}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>

                <Button
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    ml: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "rgba(255,255,255,0.9)",
                    px: 2,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "#fff"
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/feedback" sx={navBtn("/feedback")}>Feedback</Button>
                <Button href={CORPORATE_URL} target="_blank" rel="noopener noreferrer" sx={navBtn("")}>Corporate</Button>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    mx: 0.5, px: 2, borderRadius: 2, textTransform: "none",
                    fontWeight: "bold", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    ml: 1, borderRadius: 2, textTransform: "none",
                    background: "linear-gradient(90deg, #602e7d, #054474)",
                    fontWeight: "bold",
                    boxShadow: "0 3px 10px rgba(96,46,125,0.4)",
                    "&:hover": { opacity: 0.9 }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
