import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";

function NotFoundPage() {
  const token = localStorage.getItem("token");
  return (
    <Box
      sx={{
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f0ff 0%, #e3f2fd 100%)"
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center", py: 8 }}>
        <SpaIcon sx={{ fontSize: "5rem", color: "#602e7d", mb: 2 }} />
        <Typography
          variant="h1"
          sx={{ fontWeight: 900, fontSize: "6rem", color: "#602e7d", lineHeight: 1 }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#333", mt: 1, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 4, maxWidth: 380, mx: "auto" }}>
          The page you are looking for does not exist or has been moved. Return to your wellness journey.
        </Typography>
        <Button
          component={Link}
          to={token ? "/dashboard" : "/login"}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 3,
            px: 5,
            py: 1.5,
            background: "linear-gradient(135deg, #054474, #602e7d)",
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 6px 20px rgba(96,46,125,0.3)",
            "&:hover": { opacity: 0.9 }
          }}
        >
          {token ? "Go to Dashboard" : "Go to Login"}
        </Button>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
