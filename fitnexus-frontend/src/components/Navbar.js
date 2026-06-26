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
    color: isActive(path) ? "#2e7d32" : "#555",
    fontWeight: isActive(path) ? "bold" : "medium",
    backgroundColor: isActive(path) ? "rgba(46, 125, 50, 0.08)" : "transparent",
    borderRadius: 2,
    mx: 0.5,
    px: 2,
    textTransform: "none",
    fontSize: "0.95rem",
    "&:hover": {
      backgroundColor: "rgba(46, 125, 50, 0.12)",
      color: "#2e7d32"
    }
  });

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: "64px" }}>
          <Box sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#2e7d32", flexGrow: 1 }}>
            <Forest sx={{ mr: 1, fontSize: "1.8rem" }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={token ? "/dashboard" : "/login"}
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
                textDecoration: "none",
                color: "#2e7d32"
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
                  color="success"
                  size="small"
                  sx={{
                    ml: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: "#2e7d32",
                    color: "#2e7d32",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.05)",
                      borderColor: "#1b5e20"
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
                    backgroundColor: "#2e7d32",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#1b5e20"
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
