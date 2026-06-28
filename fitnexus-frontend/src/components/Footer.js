import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", // clean professional gradient
        borderTop: "1px solid rgba(0,0,0,0.08)"
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#555", fontWeight: 500 }}
        >
          © 2026 FitNexus |{" "}
          <a
            href="https://github.com/komalghodke"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgb(114, 76, 175)", textDecoration: "none", fontWeight: "bold" }}
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