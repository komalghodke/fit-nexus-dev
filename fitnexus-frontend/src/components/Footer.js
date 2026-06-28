import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 0,
        py: 4, // increased vertical padding for more height
        background: "linear-gradient(135deg, #255f9a 30%, #e0c3fc 70%)", // same gradient style as Navbar
        borderTop: "3px solid rgba(239, 235, 244, 0.4)", // thicker border accent
        boxShadow: "0 -4px 16px rgba(114,76,175,0.25)" // subtle shadow at the top
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body1"
          align="center"
          sx={{ color: "#fff", fontWeight: 600, fontSize: "0.8rem" }} // larger, white text for contrast
        >
          © 2026 FitNexus |{" "}
          <a
            href="https://github.com/komalghodke"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "underline",
              fontWeight: "bold"
            }}
          >
            github.com/komalghodke
          </a>{" "}
          | All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;