import React from "react";
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent,
  Avatar, Chip, Button, Divider, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import {
  SelfImprovement, Spa, FitnessCenter, Psychology, Favorite,
  CheckCircle, AutoAwesome, MenuBook, NaturePeople, AccountCircle,
  ArrowForward, HistoryEdu, LocalHospital, School, Verified
} from "@mui/icons-material";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <Box sx={{ background: "linear-gradient(165deg, #fdf6ff 0%, #f0f7ff 50%, #f5f0ff 100%)", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">

        {/* ── 1. Hero Header Banner ──────────────────────────────────── */}
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            background: "linear-gradient(135deg, #091e36 0%, #1a4979 45%, #4a1f60 100%)",
            color: "#fff",
            boxShadow: "0 16px 50px rgba(96,46,125,0.3)",
            mb: 6,
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Background glow circle */}
          <Box
            sx={{
              position: "absolute", top: -60, right: -60, width: 260, height: 260,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(179,157,219,0.2) 0%, transparent 70%)",
              filter: "blur(20px)"
            }}
          />

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
                <Chip
                  icon={<Verified sx={{ color: "#a5d6a7 !important" }} />}
                  label="YCB Certified Yoga Curriculum Aligned"
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#ffffff", fontWeight: 700, fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.3)" }}
                />
                <Chip
                  label="Predictive AI Powered"
                  sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#ffffff", fontWeight: 600, fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.2)" }}
                />
              </Box>

              {/* Glowing High-Contrast Gradient Title */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.15,
                  mb: 2.5,
                  letterSpacing: -0.5,
                  background: "linear-gradient(90deg, #ffe082 0%, #a5d6a7 50%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
              >
                Harmonizing Ancient Indian Wisdom with Modern Predictive AI 🌿
              </Typography>

              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.92)", lineHeight: 1.8, fontSize: "1.12rem", mb: 3.5, maxWidth: 750 }}>
                Welcome to <strong>FitNexus</strong> — India's premier holistic wellness ecosystem. FitNexus bridges 5,000 years of Vedic wellness principles with cutting-edge multi-variable AI analytics to guide you toward balanced health in body, mind, and spirit.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link} to="/register" variant="contained" size="large"
                  sx={{
                    bgcolor: "#ffffff", color: "#4a1f60", fontWeight: 800, borderRadius: 3, px: 4, py: 1.4,
                    textTransform: "none", boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                    "&:hover": { bgcolor: "#f3e5f5" }
                  }}
                >
                  Join FitNexus Free →
                </Button>
                <Button
                  component={Link} to="/wellness" variant="outlined" size="large"
                  sx={{
                    color: "#ffffff", borderColor: "rgba(255,255,255,0.6)", fontWeight: 700, borderRadius: 3, px: 3, py: 1.4,
                    textTransform: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.15)", borderColor: "#ffffff" }
                  }}
                >
                  Take Wellness Assessment
                </Button>
              </Box>
            </Grid>

            {/* Project Identity Card */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#ffffff",
                  p: 3,
                  textAlign: "center"
                }}
              >
                <Avatar
                  sx={{
                    width: 92, height: 92, mx: "auto", mb: 2,
                    bgcolor: "#ffffff", color: "#602e7d", border: "3px solid rgba(255,255,255,0.5)",
                    fontSize: "2.2rem", fontWeight: 900,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                  }}
                >
                  🌿
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5, color: "#ffffff" }}>
                  FitNexus Team
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: "#ffe082", fontWeight: 800, mb: 1.5, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  HOLISTIC WELLNESS PLATFORM
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.83rem", lineHeight: 1.6, mb: 2 }}>
                  A dedicated team committed to integrating ancient Vedic wisdom with modern AI technology, empowering every individual on their wellness journey.
                </Typography>
                <Chip
                  icon={<School sx={{ color: "#ffffff !important", fontSize: "0.9rem !important" }} />}
                  label="YCB Curriculum Aligned"
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.22)", color: "#ffffff", fontWeight: 700, fontSize: "0.7rem", border: "1px solid rgba(255,255,255,0.4)" }}
                />
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* ── 2. Who We Are & What We Do ──────────────────────────── */}
        <Grid container spacing={4} sx={{ mb: 6 }} alignItems="stretch">
          {/* Who We Are Card */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                borderRadius: 5,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                p: { xs: 3, md: 4.5 },
                boxShadow: "0 10px 35px rgba(96,46,125,0.07)",
                border: "1px solid rgba(96,46,125,0.12)",
                borderLeft: "8px solid #602e7d",
                bgcolor: "#ffffff"
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                  <Avatar sx={{ bgcolor: "#f3e5f5", color: "#602e7d", width: 50, height: 50 }}>
                    <Spa sx={{ fontSize: "1.8rem" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#602e7d", lineHeight: 1.1 }}>
                      Who We Are
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888", fontWeight: 600 }}>
                      Our Identity, Roots &amp; Purpose
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ color: "#2c2c2c", lineHeight: 1.85, mb: 2, fontWeight: 500 }}>
                  FitNexus is an independent educational and personal wellness ecosystem created to address the modern health crisis of chronic stress, digital fatigue, sedentary posture, and fragmented wellness tracking.
                </Typography>
                <Typography variant="body2" sx={{ color: "#555555", lineHeight: 1.8, mb: 2 }}>
                  FitNexus is rooted in the conviction that true health is not merely the absence of disease, but a vibrant, multi-dimensional state of physical, mental, emotional, and spiritual harmony.
                </Typography>
                <Typography variant="body2" sx={{ color: "#555555", lineHeight: 1.8, mb: 2 }}>
                  Unlike basic step counters or calorie-tracking apps, FitNexus measures your complete well-being across <strong>27 qualitative and quantitative health indicators</strong> — mapping your energy state to the ancient <strong>7 Chakra system</strong> and traditional <strong>YCB (Yoga Certification Board)</strong> educational standards.
                </Typography>
                <Typography variant="body2" sx={{ color: "#555555", lineHeight: 1.8 }}>
                  Our platform serves as a compassionate digital sanctuary, empowering users across all age groups to embark on a lifelong journey of self-reflection, posture correction, and mindful living.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed rgba(96,46,125,0.15)", display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label="🌿 Vedic Science" size="small" sx={{ bgcolor: "#f3e5f5", color: "#602e7d", fontWeight: 700 }} />
                <Chip label="🧘 YCB Aligned" size="small" sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }} />
                <Chip label="🕉️ 7 Chakras" size="small" sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 700 }} />
              </Box>
            </Card>
          </Grid>

          {/* What We Do Card */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card
              sx={{
                borderRadius: 5,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                p: { xs: 3, md: 4.5 },
                boxShadow: "0 10px 35px rgba(5,68,116,0.07)",
                border: "1px solid rgba(5,68,116,0.12)",
                borderLeft: "8px solid #054474",
                bgcolor: "#ffffff"
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                  <Avatar sx={{ bgcolor: "#e3f2fd", color: "#054474", width: 50, height: 50 }}>
                    <AutoAwesome sx={{ fontSize: "1.8rem" }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#054474", lineHeight: 1.1 }}>
                      What We Do
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888", fontWeight: 600 }}>
                      Our Core Features &amp; Platform Capabilities
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ color: "#2c2c2c", lineHeight: 1.85, mb: 2, fontWeight: 500 }}>
                  We provide a multi-tiered platform designed for individual members, certified staff, and corporate fitness centers:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.6 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Chip label="📊" size="small" sx={{ bgcolor: "#e3f2fd", fontSize: "0.85rem" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#054474" }}>Predictive Multi-Variable Wellness Scoring</Typography>
                      <Typography variant="caption" sx={{ color: "#555", lineHeight: 1.4, display: "block" }}>A 1-10 wellness score penalizing high stress, low sleep, high BMI, and nature time deficit.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Chip label="🧘" size="small" sx={{ bgcolor: "#f3e5f5", fontSize: "0.85rem" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#602e7d" }}>YCB-Aligned Asana &amp; Pranayama Prescriptions</Typography>
                      <Typography variant="caption" sx={{ color: "#555", lineHeight: 1.4, display: "block" }}>Tailored posture plans for Back, Neck, Knee, and Joint pain relief.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Chip label="🤖" size="small" sx={{ bgcolor: "#fff3e0", fontSize: "0.85rem" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#e65100" }}>GenAI Google Gemini Companion</Typography>
                      <Typography variant="caption" sx={{ color: "#555", lineHeight: 1.4, display: "block" }}>Context-aware AI wellness assistant providing immediate health guidance.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Chip label="📋" size="small" sx={{ bgcolor: "#f1f8e9", fontSize: "0.85rem" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2e7d32" }}>Trainer &amp; Staff Prescription Desk</Typography>
                      <Typography variant="caption" sx={{ color: "#555", lineHeight: 1.4, display: "block" }}>Role-gated portal where certified Yoga Instructors and Trainers log student guidance.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Chip label="🏬" size="small" sx={{ bgcolor: "#e0f2f1", fontSize: "0.85rem" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#00796b" }}>Corporate Gym &amp; Studio Dashboard</Typography>
                      <Typography variant="caption" sx={{ color: "#555", lineHeight: 1.4, display: "block" }}>C# .NET microservice integration for studio and gym management oversight.</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed rgba(5,68,116,0.15)", display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label="⚡ Quick Logging" size="small" sx={{ bgcolor: "#e3f2fd", color: "#054474", fontWeight: 700 }} />
                <Chip label="🤖 Gemini AI" size="small" sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 700 }} />
                <Chip label="📄 PDF Reports" size="small" sx={{ bgcolor: "#f3e5f5", color: "#602e7d", fontWeight: 700 }} />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ── 3. Why Modern Society Needs Holistic Wellness ────────── */}
        <Paper sx={{ p: { xs: 4, md: 5 }, borderRadius: 5, bgcolor: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.04)", mb: 6 }}>
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mb: 4 }}>
            <Typography variant="overline" sx={{ color: "#602e7d", fontWeight: 800, letterSpacing: 2 }}>
              THE WELLNESS IMPERATIVE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0d2c4e", mt: 0.5, mb: 2 }}>
              Why Modern Life Demands a 6-Dimensional Approach
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
              Modern lifestyles subject our bodies and minds to unprecedented pressures: prolonged desk sitting, digital eye strain, disrupted sleep cycles, processed foods, and constant hyper-connectivity. Health is not merely the absence of disease — it is a dynamic state of complete physical, mental, emotional, social, spiritual, and environmental harmony.
            </Typography>
          </Box>

          <Divider sx={{ mb: 5 }} />

          {/* 6 Dimensions Focus Grid */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#602e7d", mb: 3, textAlign: "center" }}>
            The 6 Dimensions of Wellness at FitNexus
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                title: "1. Physical Wellness",
                icon: "🌿",
                color: "#2e7d32",
                bg: "#f1f8e9",
                desc: "Nourishing the physical temple through dynamic Asana movement, MET-tracked exercise, balanced sattvic nutrition, optimal hydration, and restorative sleep."
              },
              {
                title: "2. Mental & Emotional Wellness",
                icon: "🧠",
                color: "#c2185b",
                bg: "#fce4ec",
                desc: "Cultivating psychological resilience through Pranayama (Nadi Shodhana, Bhramari), subjective mood tracking, stress management, and daily journaling."
              },
              {
                title: "3. Spiritual Wellness",
                icon: "🕉️",
                color: "#602e7d",
                bg: "#f3e5f5",
                desc: "Connecting with higher purpose and inner peace via 7 Chakra energy alignment, mantra chanting, candle gazing (Trataka), and mindful stillness."
              },
              {
                title: "4. Social & Community Wellness",
                icon: "👥",
                color: "#1565c0",
                bg: "#e3f2fd",
                desc: "Fostering meaningful human connections, instructor-student mentorship, supportive family relationships, and empathetic community feedback."
              },
              {
                title: "5. Environmental Wellness",
                icon: "🍃",
                color: "#00796b",
                bg: "#e0f2f1",
                desc: "Reconnecting with nature (Prakriti), spending time outdoors, respecting environmental rhythms, and creating harmonious living spaces."
              },
              {
                title: "6. Occupational & Lifestyle Balance",
                icon: "💼",
                color: "#e65100",
                bg: "#fff3e0",
                desc: "Establishing healthy boundaries between work productivity, ergonomic posture, stress recovery, and lifelong personal growth."
              }
            ].map((d, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ borderRadius: 4, height: "100%", bgcolor: d.bg, border: `1px solid ${d.color}25`, boxShadow: "none" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: "2rem", mb: 1 }}>{d.icon}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: d.color, mb: 1 }}>
                      {d.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7 }}>
                      {d.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* ── 4. FEATURED BLOG POST ON YOGA ────────────────────────── */}
        <Paper
          id="yoga-blog"
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            bgcolor: "#fff",
            boxShadow: "0 16px 50px rgba(96,46,125,0.09)",
            border: "2px solid rgba(96,46,125,0.12)",
            mb: 6
          }}
        >
          {/* Blog Header Tag */}
          <Box sx={{ display: "flex", alignItems: "center", justifyBetween: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Chip
              icon={<HistoryEdu sx={{ color: "#602e7d !important" }} />}
              label="Featured Educational Masterclass"
              sx={{ bgcolor: "#f3e5f5", color: "#602e7d", fontWeight: 800, fontSize: "0.75rem" }}
            />
            <Typography variant="caption" sx={{ color: "#888", fontWeight: 600 }}>
              Reading Time: 8 Mins · Authoritative Ayurvedic &amp; Yogic Article
            </Typography>
          </Box>

          <Typography variant="h3" component="h2" sx={{ fontWeight: 900, color: "#0d2c4e", lineHeight: 1.2, mb: 2 }}>
            Yoga: India's Eternal Gift to Humanity — Why Every Age Group Needs Daily Abhyasa 🧘‍♀️
          </Typography>

          {/* Author Byline Box */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5, bgcolor: "#faf6ff", borderRadius: 3, borderLeft: "4px solid #602e7d", mb: 4 }}>
            <Avatar sx={{ bgcolor: "#602e7d", color: "#fff", fontWeight: "bold", width: 50, height: 50 }}>🌿</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#602e7d" }}>
                FitNexus Wellness Team
              </Typography>
              <Typography variant="caption" sx={{ color: "#555", display: "block" }}>
                YCB (Yoga Certification Board) Curriculum Aligned · Ministry of AYUSH Educational Standards · Vedic Wellness Practitioners
              </Typography>
            </Box>
          </Box>

          {/* Blog Article Content */}
          <Box sx={{ color: "#333", lineHeight: 1.9, fontSize: "1.05rem" }}>

            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e", mt: 3, mb: 1.5 }}>
              1. The Ancient Vedic Origins &amp; Philosophical Roots of Yoga
            </Typography>
            <Typography variant="body1" paragraph>
              Yoga is not a modern fitness invention — it is an eternal, profound spiritual and physiological science that originated in ancient India over <strong>5,000 years ago</strong>. The earliest references to Yoga are codified in the <em>Rigveda</em>, the oldest of the sacred Vedic texts, and further expanded in the <em>Upanishads</em> and Maharishi Patanjali’s seminal work, the <em>Yoga Sutras</em>.
            </Typography>
            <Typography variant="body1" paragraph>
              The word "Yoga" derives from the Sanskrit root <strong>Yuj (युज्)</strong>, meaning "to join, yoke, or unite." It signifies the sacred union of individual consciousness (Jivatma) with universal consciousness (Paramatma), and the harmonious integration of body, mind, and breath. Patanjali famously defined Yoga as:
            </Typography>

            <Box sx={{ p: 3, bgcolor: "#fdf8ff", borderRadius: 3, borderLeft: "4px solid #602e7d", my: 2, fontStyle: "italic" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#602e7d", mb: 0.5 }}>
                "योगश्चित्तवृत्तिनिरोधः" (Yogas Chitta Vritti Nirodhah)
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                — Yoga Sutras of Patanjali (1.2) | <em>"Yoga is the stilling of the fluctuations and turbulence of the mind."</em>
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e", mt: 4, mb: 1.5 }}>
              2. Why Yoga is Essential Across Every Stage of Life (All Ages)
            </Typography>
            <Typography variant="body1" paragraph>
              A common misconception is that Yoga is only for the flexible, the young, or the ascetic. In reality, Maharishi Patanjali designed Yoga as a universal science accessible to everyone — regardless of age, gender, background, or physical capability. Here is why every age group requires daily yogic <em>Abhyasa</em> (consistent practice):
            </Typography>

            {/* Age Group Accordions / Sections */}
            <Grid container spacing={3} sx={{ my: 2 }}>
              {/* Children */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 4, bgcolor: "#f1f8e9", borderLeft: "5px solid #2e7d32", height: "100%" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#2e7d32", mb: 1 }}>
                    🧒 Children (Ages 5–12): Foundation &amp; Immunity
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.7 }}>
                    For growing children, playful posture flows like <strong>Vrikshasana (Tree Pose)</strong> and <strong>Simhasana (Lion Pose)</strong> improve balance, bone growth, spinal alignment, and immune defense. Gentle breathing games increase oxygen flow to the brain, enhancing academic focus and emotional stability.
                  </Typography>
                </Card>
              </Grid>

              {/* Teens */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 4, bgcolor: "#e3f2fd", borderLeft: "5px solid #1565c0", height: "100%" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1565c0", mb: 1 }}>
                    🎒 Teens &amp; Students (Ages 13–21): Focus &amp; Stress Relief
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.7 }}>
                    Adolescence brings hormonal shifts, examination pressure, and digital eye strain. <strong>Surya Namaskar (Sun Salutation)</strong> combined with <strong>Nadi Shodhana Pranayama</strong> balances hormonal glands, clears acne, reduces anxiety, and builds physical confidence and posture.
                  </Typography>
                </Card>
              </Grid>

              {/* Working Adults */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 4, bgcolor: "#fff3e0", borderLeft: "5px solid #e65100", height: "100%" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#e65100", mb: 1 }}>
                    💼 Working Adults (Ages 22–55): Posture &amp; Burnout Recovery
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.7 }}>
                    Desk-bound professionals suffer from lower back pain, neck stiffness, digestive sluggishness, and work burnout. <strong>Cat-Cow Pose (Marjaryasana)</strong>, <strong>Bhujangasana (Cobra)</strong>, and <strong>Kapalbhati Pranayama</strong> restore core strength, boost metabolic calorie burn, and relieve chronic stress.
                  </Typography>
                </Card>
              </Grid>

              {/* Seniors */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 4, bgcolor: "#f3e5f5", borderLeft: "5px solid #602e7d", height: "100%" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#602e7d", mb: 1 }}>
                    👵 Seniors &amp; Elders (Ages 56+): Joint Mobility &amp; Longevity
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.7 }}>
                    In golden years, gentle <strong>Chair Yoga</strong>, <strong>Sukshma Vyayama (micro-stretches)</strong>, and <strong>Bhramari (Humming Bee Breath)</strong> preserve joint lubrication, maintain bone density, prevent cognitive decline, and cultivate deep inner serenity.
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <br />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e", mt: 4, mb: 1.5 }}>
              3. The Power of Abhyasa (Consistent Practice) &amp; Vairagya
            </Typography>
            <Typography variant="body1" paragraph>
              In Yoga Sutra 1.14, Patanjali emphasizes: <em>"Sa tu dirghakala nairantarya satkara-asevito dridhabhumih"</em> — practice becomes firmly grounded only when pursued uninterruptedly, with devotion, for a long duration. Yoga is not a 30-day challenge; it is a lifelong companion.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d2c4e", mt: 4, mb: 1.5 }}>
              4. Start Your Practice Today with FitNexus
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you can practice for 10 minutes or 60 minutes, the key is simply to begin. At FitNexus, we honor this sacred tradition by giving you individualized pose recommendations aligned with your unique body assessment, pain areas, and stress metrics.
            </Typography>

            <Box sx={{ mt: 4, p: 4, bgcolor: "#faf6ff", borderRadius: 4, textAlign: "center", border: "1px solid rgba(96,46,125,0.15)" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#602e7d", mb: 1 }}>
                Ready to Begin Your Personal Yoga Journey?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Take your 5-minute wellness assessment and unlock personalized YCB-aligned yoga recommendations today.
              </Typography>
              <Button
                component={Link} to="/wellness" variant="contained" size="large"
                sx={{
                  bgcolor: "#602e7d", color: "#fff", fontWeight: 800, borderRadius: 3, px: 4, py: 1.4, textTransform: "none",
                  boxShadow: "0 6px 20px rgba(96,46,125,0.3)", "&:hover": { bgcolor: "#4a1f60" }
                }}
              >
                🧘 Start Assessment Now
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* ── 5. Legal & AYUSH Non-Affiliation Notice ──────────────── */}
        <Paper sx={{ p: 3, bgcolor: "#fef9f0", borderRadius: 4, borderLeft: "5px solid #e65100" }}>
          <Typography variant="caption" sx={{ color: "#b45309", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 0.5 }}>
            ⚠️ Important Disclaimer &amp; Non-Affiliation Statement
          </Typography>
          <Typography variant="caption" sx={{ color: "#8b6914", lineHeight: 1.7, display: "block" }}>
            FitNexus is an independent educational wellness platform. FitNexus is <strong>NOT affiliated with, endorsed by, or sponsored by the Ministry of AYUSH or the Government of India (GOI)</strong>. All YCB references pertain to educational syllabus standards used for curriculum alignment. <strong>FITNEXUS DOES NOT PROVIDE MEDICAL DIAGNOSIS, CLINICAL ADVICE, OR DOCTOR PRESCRIPTIONS.</strong> Always consult a qualified physician for medical concerns.
          </Typography>
        </Paper>

      </Container>
    </Box>
  );
}

export default AboutPage;
