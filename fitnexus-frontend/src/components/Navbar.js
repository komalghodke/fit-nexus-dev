import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Forest } from "@mui/icons-material";

function Navbar() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItemStyles = (path) => ({
    color: isActive(path) ? "rgb(114, 76, 175)" : "#555",
    fontWeight: isActive(path) ? "bold" : "medium",
    backgroundColor: isActive(path) ? "rgba(114, 76, 175, 0.08)" : "transparent",
    borderRadius: 2,
    mx: 0.5,
    px: 2,
    textTransform: "none",
    fontSize: "0.95rem",
    "&:hover": {
      backgroundColor: "rgba(114, 76, 175, 0.12)",
      color: "rgb(114, 76, 175)"
    }
  });

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: "64px" }}>
          <Box sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "rgb(114, 76, 175)", flexGrow: 1 }}>
            <Forest sx={{ mr: 1, fontSize: "1.8rem", color: "rgb(114, 76, 175)" }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={token ? "/dashboard" : "/login"}
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
                textDecoration: "none",
                color: "rgb(114, 76, 175)"
              }}
            >
              FitNexus
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {token ? (
              <>
                <Button component={Link} to="/dashboard" sx={navItemStyles("/dashboard")}>
                  Dashboard
                </Button>
                <Button component={Link} to="/profile" sx={navItemStyles("/profile")}>
                  Profile
                </Button>
                <Button component={Link} to="/reports" sx={navItemStyles("/reports")}>
                  Reports
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  sx={{
                    ml: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: "rgb(114, 76, 175)",
                    color: "rgb(114, 76, 175)",
                    "&:hover": {
                      backgroundColor: "rgba(114, 76, 175, 0.05)",
                      borderColor: "#5a3a9d"
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={navItemStyles("/login")}>
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    ml: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    background: "linear-gradient(90deg, #3498db, rgb(114, 76, 175))",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2980b9, #5a3a9d)"
                    }
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
