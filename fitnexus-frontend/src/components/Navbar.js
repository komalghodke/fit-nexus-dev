import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";

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
        background: "linear-gradient(90deg, #255f9a 30%, #e0c3fc 70%)", // gradient background
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 12px rgba(217, 213, 223, 0.25)", // subtle purple shadow
        borderBottom: "2px solid rgba(243, 241, 246, 0.3)" // clean border accent
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: "100px", px: 6, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexGrow: 1
            }}
          >
            <SpaIcon sx={{ mr: 1, fontSize: "1.8rem", color: "#fff" }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={token ? "/dashboard" : "/login"}
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.5px",
                textDecoration: "none",
                color: "#fff",
                fontSize: "1.4rem"
              }}
            >
              FitNexus
            </Typography>
          </Box>

          {/* Nav Items */}
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
                    borderColor: "#fff",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "#ddd"
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Login styled differently */}
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    mx: 0.5,
                    px: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "#fff",
                    border: "1px solid #fff",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)"
                    }
                  }}
                >
                  Login
                </Button>

                {/* Register with gradient */}
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    ml: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    background: "linear-gradient(90deg, #14364d, rgb(114, 76, 175))",
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
