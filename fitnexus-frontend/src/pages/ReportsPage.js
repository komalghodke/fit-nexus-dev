import React, { useEffect, useState, useRef } from "react";
import { fetchReport } from "../api/reportsApi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import WellnessChatbot from "../components/WellnessChatbot";
import {
  Box, Container, Grid, Card, CardContent, Typography, Button,
  Divider, List, ListItem, ListItemIcon, ListItemText, CircularProgress,
  Alert, Chip, Avatar, Paper
} from "@mui/material";
import {
  FitnessCenter, Bedtime, Psychology, AssignmentTurnedIn,
  Print, Spa, CheckCircle, Warning, Person, FavoriteOutlined,
  WaterDrop, SelfImprovement, NaturePeople,
  AutoAwesome, MenuBook, LocalHospital, Favorite,
  Download
} from "@mui/icons-material";

// Chakra color map
const chakraMap = {
  Root: { color: "#e53935", label: "🔴 Root Chakra", meaning: "Grounding, safety, survival." },
  Sacral: { color: "#fb8c00", label: "🟠 Sacral Chakra", meaning: "Creativity, sensuality, emotional flow." },
  "Solar Plexus": { color: "#fdd835", label: "🟡 Solar Plexus", meaning: "Confidence, control, personal power." },
  Heart: { color: "#43a047", label: "🟢 Heart Chakra", meaning: "Compassion, love, grief." },
  Throat: { color: "#1e88e5", label: "🔵 Throat Chakra", meaning: "Expression, truth, communication." },
  "Third Eye": { color: "#5e35b1", label: "🟣 Third Eye Chakra", meaning: "Intuition, clarity, insight." },
  Crown: { color: "#8e24aa", label: "🟪 Crown Chakra", meaning: "Bliss, transcendence, spiritual connection." }
};

function InfoRow({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 0.8 }}>
      <Box sx={{ color: "#602e7d", mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: "#888", display: "block", lineHeight: 1.2 }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>{value}</Typography>
      </Box>
    </Box>
  );
}

function SectionCard({ title, icon, color = "#602e7d", bg = "#fdf8ff", children }) {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderLeft: `5px solid ${color}`, mb: 3, background: bg }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box sx={{ color, fontSize: "1.5rem" }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color }}>{title}</Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const reportRef = useRef(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await fetchReport(userId);
        setReport(data);
      } catch (err) {
        console.error("Error fetching report", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [userId]);

  const downloadPdf = async () => {
    if (!reportRef.current) return;
    setPdfLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const name = report?.fullName ? report.fullName.replace(/\s+/g, "_") : "User";
      pdf.save(`FitNexus_Wellness_Report_${name}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF. Please try the Print option instead.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!report) {
    return (
      <Box
        sx={{
          minHeight: "80vh", display: "flex", alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf6ff 0%, #ede7f6 100%)",
          px: 2
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{
            borderRadius: 5, p: 2, textAlign: "center",
            boxShadow: "0 20px 60px rgba(96,46,125,0.15)",
            border: "2px solid #ede0fa"
          }}>
            <CardContent>
              <Typography variant="h1" sx={{ fontSize: "4.5rem", mb: 2 }}>🌿</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#602e7d", mb: 1 }}>
                Your Wellness Report Awaits
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 3, lineHeight: 1.8 }}>
                Complete the <strong>Wellness Assessment Form</strong> to unlock your personalised
                holistic report — including your Wellness Score, Chakra alignment, Yoga prescription,
                mood insights, and AYUSH recommendations.
              </Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}>
                🕐 Takes only <strong>5–7 minutes</strong> to complete. Your data stays private and secure.
              </Alert>
              <Button
                variant="contained" size="large" href="/wellness"
                sx={{
                  bgcolor: "#602e7d", color: "#fff", fontWeight: 700,
                  borderRadius: 3, px: 4, py: 1.5, textTransform: "none",
                  fontSize: "1rem", "&:hover": { bgcolor: "#4a1f60" }
                }}
              >
                🧘 Start Wellness Assessment
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const scoreVal = report.score || 1;
  const statusLabel = report.status || "Needs Attention";
  const chakraKey = report.chakra || "Crown";
  const chakraInfo = chakraMap[chakraKey] || chakraMap["Crown"];

  const getStatusColor = (s) => {
    if (s === "Excellent") return "#2e7d32";
    if (s === "Moderate") return "#e65100";
    return "#c62828";
  };
  const themeColor = getStatusColor(statusLabel);
  const chartData = [{ name: "Score", value: scoreVal }, { name: "Remaining", value: 10 - scoreVal }];
  const COLORS = [themeColor, "#eeeeee"];

  const stressLabel = report.stressLevel > 7 ? "High" : report.stressLevel > 4 ? "Moderate" : "Low";

  return (
    <Box sx={{ background: "linear-gradient(160deg, #fdf6ff 0%, #f0f7f0 50%, #f5f0ff 100%)", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>

        {/* ── Print style injected globally so it catches AppBar/Footer outside this container ── */}
        <style>{`
          @media print {
            header, nav, footer, .MuiAppBar-root, .MuiDrawer-root,
            .no-print, button, .recharts-wrapper { display: none !important; }
            body { background: white !important; font-size: 11pt; }
            .MuiContainer-root { padding: 0 !important; max-width: 100% !important; }
            .MuiCard-root { box-shadow: none !important; border: 1px solid #ddd !important; break-inside: avoid; }
            @page { margin: 15mm 12mm; size: A4 portrait; }
          }
        `}</style>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: "#602e7d" }}>
              🌿 Wellness Companion Insights
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your Personalized Guidance — Holistic Lifestyle & YCB Assessment Report
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outlined" onClick={() => window.print()} startIcon={<Print />} className="no-print"
              sx={{
                color: "#602e7d", borderColor: "#602e7d", fontWeight: 700,
                borderRadius: 3, px: 2.5, textTransform: "none",
                "&:hover": { bgcolor: "#faf0ff", borderColor: "#4a1f60" }
              }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              onClick={downloadPdf}
              startIcon={pdfLoading ? null : <Download />}
              disabled={pdfLoading}
              className="no-print"
              sx={{
                bgcolor: "#602e7d", fontWeight: "bold", borderRadius: 3,
                px: 3, textTransform: "none",
                "&:hover": { bgcolor: "#4a1f60" }
              }}
            >
              {pdfLoading ? "Generating…" : "Download PDF"}
            </Button>
          </Box>
        </Box>

        <div ref={reportRef}>
        <Grid container spacing={4}>

          {/* ══ LEFT COLUMN ══════════════════════════════════════════════ */}
          <Grid item xs={12} md={5}>

            {/* Questionnaire Summary */}
            <SectionCard title="Questionnaire Summary" icon={<MenuBook />} color="#054474" bg="#f0f7ff">

              {/* Personal */}
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#054474", display: "block", mb: 1 }}>👤 Personal Information</Typography>
              <Box sx={{ pl: 1 }}>
                <InfoRow icon={<Person fontSize="small" />} label="Full Name" value={report.fullName} />
                <InfoRow icon={<Person fontSize="small" />} label="Gender" value={report.gender} />
                <InfoRow icon={<Person fontSize="small" />} label="Age" value={report.age ? `${report.age} years` : null} />
                <InfoRow icon={<NaturePeople fontSize="small" />} label="City" value={report.city} />
              </Box>
              <Divider sx={{ my: 1.5 }} />

              {/* Physical */}
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#2e7d32", display: "block", mb: 1 }}>📊 Physical Wellness</Typography>
              <Box sx={{ pl: 1 }}>
                <InfoRow icon={<FitnessCenter fontSize="small" />} label="Height / Weight" value={report.height && report.weight ? `${report.height} cm / ${report.weight} kg` : null} />
                <InfoRow icon={<FitnessCenter fontSize="small" />} label="Calculated BMI" value={report.bmi ? report.bmi.toFixed(1) : null} />
                {report.bmi && (
                  <Box sx={{ pl: 4, mb: 1 }}>
                    {(() => {
                      const val = report.bmi;
                      if (val < 18.5) {
                        return (
                          <Typography variant="caption" sx={{ color: "#0288d1", fontWeight: 700, display: "block" }}>
                            💡 Underweight: Nutrient-dense diet & strength workouts advised.
                          </Typography>
                        );
                      } else if (val < 25) {
                        return (
                          <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 700, display: "block" }}>
                            💡 Normal Weight: Maintain balanced energy intake and exercise.
                          </Typography>
                        );
                      } else {
                        return (
                          <Typography variant="caption" sx={{ color: "#e65100", fontWeight: 700, display: "block" }}>
                            💡 Overweight: Caloric deficit & active dynamic yoga advised.
                          </Typography>
                        );
                      }
                    })()}
                  </Box>
                )}
                <InfoRow icon={<WaterDrop fontSize="small" />} label="Water Intake" value={report.waterIntake ? `${report.waterIntake} L/day` : null} />
                <InfoRow icon={<FavoriteOutlined fontSize="small" />} label="Resting Heart Rate" value={report.restingHeartRate ? `${report.restingHeartRate} BPM` : null} />
                <InfoRow icon={<Bedtime fontSize="small" />} label="Sleep Duration" value={report.sleepHours ? `${report.sleepHours} hrs/night` : null} />
                <InfoRow icon={<Bedtime fontSize="small" />} label="Sleep Quality" value={report.sleepQuality} />
                <InfoRow icon={<Psychology fontSize="small" />} label="Digestive Issues" value={report.digestiveIssues} />
                <InfoRow icon={<Psychology fontSize="small" />} label="Pain Area" value={report.painArea} />
              </Box>
              <Divider sx={{ my: 1.5 }} />

              {/* Emotional */}
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#c62828", display: "block", mb: 1 }}>🧠 Emotional Wellness</Typography>
              <Box sx={{ pl: 1 }}>
                <InfoRow icon={<AutoAwesome fontSize="small" />} label="Mood" value={report.mood} />
                <InfoRow icon={<AutoAwesome fontSize="small" />} label="Energy Level" value={report.energyLevel} />
                <InfoRow icon={<Psychology fontSize="small" />} label="Stress Level" value={report.stressLevel ? `${report.stressLevel}/10 — ${stressLabel}` : null} />
                <InfoRow icon={<Bedtime fontSize="small" />} label="Sleep Pattern" value={report.sleepQuality} />
              </Box>
              <Divider sx={{ my: 1.5 }} />

              {/* Activity */}
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#602e7d", display: "block", mb: 1 }}>🏃 Physical Activity</Typography>
              <Box sx={{ pl: 1 }}>
                <InfoRow icon={<SelfImprovement fontSize="small" />} label="Yoga Experience" value={report.yogaExperience} />
                <InfoRow icon={<FitnessCenter fontSize="small" />} label="Activity Type" value={report.workoutType} />
                <InfoRow icon={<FitnessCenter fontSize="small" />} label="Days per Week" value={report.daysPerWeek ? `${report.daysPerWeek} days` : null} />
                <InfoRow icon={<FitnessCenter fontSize="small" />} label="Mins per Session" value={report.minutesPerSession ? `${report.minutesPerSession} mins` : null} />
              </Box>
              <Divider sx={{ my: 1.5 }} />

              {/* Spiritual / Social / Occupational / Environmental */}
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#00695c", display: "block", mb: 1 }}>🧘 Spiritual / Social / Work</Typography>
              <Box sx={{ pl: 1 }}>
                <InfoRow icon={<Spa fontSize="small" />} label="Inner Peace" value={report.innerPeace} />
                <InfoRow icon={<Favorite fontSize="small" />} label="Social Support" value={report.socialSupport} />
                <InfoRow icon={<AssignmentTurnedIn fontSize="small" />} label="Work Satisfaction" value={report.workSatisfaction ? `${report.workSatisfaction}/10` : null} />
                <InfoRow icon={<NaturePeople fontSize="small" />} label="Time in Nature" value={report.withNature ? `${report.withNature} hrs/week` : null} />
              </Box>
              <Divider sx={{ my: 1.5 }} />

              {/* Medical */}
              <Typography variant="overline" sx={{ fontWeight: 800, color: "#b71c1c", display: "block", mb: 1 }}>🩺 Medical History</Typography>
              <Box sx={{ pl: 1 }}>
                <InfoRow icon={<LocalHospital fontSize="small" />} label="Medical Condition" value={report.hasDisease === true ? "Yes" : report.hasDisease === false ? "No" : null} />
                <InfoRow icon={<LocalHospital fontSize="small" />} label="Conditions" value={report.chronicConditions} />
                <InfoRow icon={<LocalHospital fontSize="small" />} label="Medications" value={report.medications} />
              </Box>

              {/* Journal */}
              {report.journalEntry && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="overline" sx={{ fontWeight: 800, color: "#455a64", display: "block", mb: 1 }}>📝 Journal Entry</Typography>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f8f9fa", border: "1px solid #e0e0e0", fontStyle: "italic", color: "#555" }}>
                    <Typography variant="body2">"{report.journalEntry}"</Typography>
                  </Paper>
                </>
              )}
            </SectionCard>

            {/* Wellness Score */}
            <SectionCard title="Wellness Score" icon="📊" color={themeColor} bg="#fff">
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: 220, mb: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="75%" startAngle={180} endAngle={0}
                      innerRadius={65} outerRadius={85} dataKey="value" stroke="none">
                      <Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: "absolute", bottom: 25, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: themeColor, lineHeight: 1.1 }}>{scoreVal}/10</Typography>
                  <Chip label={statusLabel} size="small" sx={{ bgcolor: themeColor, color: "#fff", fontWeight: 800, mt: 0.5 }} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ textAlign: "center", color: "#666", mt: 1 }}>
                Your wellness score is <strong>{scoreVal}/10</strong> — {statusLabel === "Needs Attention" ? "⚠️ Needs Attention" : statusLabel === "Moderate" ? "🌤 Moderate" : "✅ Excellent"}
              </Typography>
            </SectionCard>

            {/* ── Predictive AI Wellness Forecasts ───────────────────── */}
            <SectionCard title="Predictive AI Forecasts" icon={<AutoAwesome />} color="#6200ea" bg="#f5f0ff">
              <Typography variant="body2" sx={{ color: "#555", mb: 2.5, lineHeight: 1.6 }}>
                Our predictive models estimate metrics below based on your activity, sleep quality, and physiological signals:
              </Typography>

              {/* Caloric Burn */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#333", display: "flex", alignItems: "center", gap: 1 }}>
                    <FitnessCenter sx={{ color: "#6200ea", fontSize: 18 }} /> Active Caloric Burn
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#6200ea" }}>
                    {report.predictedCalorieBurn || 0} kcal
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#666", display: "block", pl: 3.2 }}>
                  Estimated energy expenditure per {report.workoutDuration || 30} min session.
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Stress Forecast */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#333", display: "flex", alignItems: "center", gap: 1 }}>
                    <Psychology sx={{ color: "#6200ea", fontSize: 18 }} /> Stress Level Forecast
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#6200ea" }}>
                    {report.predictedStressTrend || 5}/10
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#666", display: "block", pl: 3.2 }}>
                  Calculated stress index trend based on rest duration and work satisfaction.
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Sleep Score */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#333", display: "flex", alignItems: "center", gap: 1 }}>
                    <Bedtime sx={{ color: "#6200ea", fontSize: 18 }} /> Sleep Quality Forecast
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#6200ea" }}>
                    {report.predictedSleepQuality || 70}/100
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#666", display: "block", pl: 3.2 }}>
                  Comprehensive sleep rating evaluating bedtime consistency and recovery.
                </Typography>
              </Box>
            </SectionCard>

          </Grid>

          {/* ══ RIGHT COLUMN ══════════════════════════════════════════════ */}
          <Grid item xs={12} md={7}>

            {/* ── Mood & Energy Tips ─────────────────────────────────── */}
            <SectionCard title="Mood & Energy Tips" icon={<Psychology />} color="#c62828" bg="#fff5f5">
              {report.mood && (
                <Box sx={{ mb: 2, p: 2, bgcolor: "#fff", borderRadius: 3, border: "1px solid #ffcdd2" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#c62828", mb: 0.5 }}>
                    🧘 Mood Insight — {report.mood}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.7 }}>
                    {report.moodInsight || `Your current mood is ${report.mood}. Awareness is the first step toward balance.`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#888", display: "block", mt: 1, fontStyle: "italic" }}>
                    Why this helps: Mood influences your breath, thoughts, and energy.
                  </Typography>
                </Box>
              )}
              {report.wellnessTips && report.wellnessTips.length > 0 && (
                <List dense>
                  {report.wellnessTips.map((tip, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle sx={{ color: "#c62828", fontSize: 18 }} /></ListItemIcon>
                      <ListItemText primary={tip} primaryTypographyProps={{ variant: "body2", color: "#444" }} />
                    </ListItem>
                  ))}
                </List>
              )}
            </SectionCard>

            {/* ── Sleep & Stress Tips ────────────────────────────────── */}
            <SectionCard title="Sleep & Stress Tips" icon={<Bedtime />} color="#1565c0" bg="#f3f8ff">
              {report.sleepTips && report.sleepTips.length > 0 ? (
                report.sleepTips.map((tip, i) => (
                  <Box key={i} sx={{ mb: 1, p: 1.5, bgcolor: "#fff", borderRadius: 2, border: "1px solid #bbdefb" }}>
                    <Typography variant="body2" sx={{ color: "#1565c0" }}>{tip}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Sleep pattern looks healthy. Keep up your routine!</Typography>
              )}
              <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "#fff", borderRadius: 2, border: "1px solid #bbdefb" }}>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  <strong>Stress:</strong> {stressLabel} — {report.stressLevel > 7 ? "😰 Practice Yoga Nidra, guided meditation, and Anulom-Vilom pranayama." : report.stressLevel > 4 ? "😌 Moderate stress can be eased with restorative yoga and mindful pauses." : "😊 Stress is well-managed. Maintain with regular breathwork."}
                </Typography>
              </Box>
            </SectionCard>

            {/* ── Hydration & Heart Health ────────────────────────────── */}
            <SectionCard title="Hydration & Heart Health" icon={<WaterDrop />} color="#00838f" bg="#f0fdfd">
              {report.hydrationTips && report.hydrationTips.length > 0 ? (
                report.hydrationTips.map((tip, i) => (
                  <Box key={i} sx={{ mb: 1, p: 1.5, bgcolor: "#fff", borderRadius: 2, border: "1px solid #b2dfdb" }}>
                    <Typography variant="body2" sx={{ color: "#00695c" }}>{tip}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Hydration and heart data not available.</Typography>
              )}
            </SectionCard>

            {/* ── Journal Reflection ─────────────────────────────────── */}
            {report.journalEntry && (
              <SectionCard title="Journal Reflection" icon="🪞" color="#455a64" bg="#f9fafb">
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "#eceff1", border: "1px dashed #90a4ae" }}>
                  <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555" }}>"{report.journalEntry}"</Typography>
                </Paper>
                <Typography variant="body2" sx={{ color: "#455a64", lineHeight: 1.7 }}>
                  {report.journalReflection || "You're observing your inner world. Let's deepen that awareness with meditative movement and stillness."}
                </Typography>
                <Typography variant="caption" sx={{ color: "#888", display: "block", mt: 1, fontStyle: "italic" }}>
                  Suggestion: Try seated meditation and Trataka to enhance clarity.
                </Typography>
              </SectionCard>
            )}

            {/* ── Affirmation + Practice + Mantra ───────────────────── */}
            <SectionCard title="Special Affirmation for you..." icon={<AutoAwesome />} color="rgb(114,76,175)" bg="linear-gradient(135deg,#f6f2fc,#faeef5)">
              <Box sx={{ p: 2.5, bgcolor: "rgba(114,76,175,0.06)", borderRadius: 3, mb: 2, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontStyle: "italic", color: "rgb(114,76,175)", lineHeight: 1.5 }}>
                  &ldquo;{report.affirmation || "I am balanced. I am well."}&rdquo;
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 3, border: "1px solid #e1bee7" }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#602e7d", display: "block", mb: 0.5 }}>
                      🧘 Practice for Your Affirmation
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      {report.yogaRecommendation || "Try mantra chanting or group yoga to reconnect."}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 3, border: "1px solid #e1bee7" }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#602e7d", display: "block", mb: 0.5 }}>
                      📿 Mantra for Today
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic", fontWeight: 600, color: "rgb(114,76,175)" }}>
                      {report.mantra || "ॐ (Om) — Universal Mantra"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </SectionCard>

            {/* ── Chakra Journey Tracker ─────────────────────────────── */}
            <SectionCard title="Chakra Journey Tracker" icon={<Spa />} color={chakraInfo.color} bg="#fffdf5">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, p: 2, bgcolor: "#fff", borderRadius: 3, border: `2px solid ${chakraInfo.color}33` }}>
                <Avatar sx={{ bgcolor: chakraInfo.color, width: 52, height: 52, fontSize: "1.6rem" }}>
                  {chakraKey === "Root" ? "🔴" : chakraKey === "Sacral" ? "🟠" : chakraKey === "Solar Plexus" ? "🟡" : chakraKey === "Heart" ? "🟢" : chakraKey === "Throat" ? "🔵" : chakraKey === "Third Eye" ? "🟣" : "🟪"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: chakraInfo.color }}>{chakraInfo.label}</Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>{chakraInfo.meaning}</Typography>
                  <Typography variant="caption" sx={{ color: "#888" }}>Active based on your current mood: <strong>{report.mood}</strong></Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: "#555", mb: 2, p: 1.5, bgcolor: "#fafafa", borderRadius: 2, borderLeft: "4px solid #602e7d", lineHeight: 1.6 }}>
                <strong>YCB Principles mapping:</strong> In traditional Yogic practices, human emotions correspond to energy centers (Chakras) along the spine. FitNexus maps your reported mood state to a primary Chakra focus to suggest customized mindfulness points. This is a personal reflection engine and not a clinical diagnosis.
              </Typography>

              {/* All chakra legend */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#888", display: "block", mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                🌈 Chakra Color Legend & Meaning
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(chakraMap).map(([key, val]) => (
                  <Chip key={key} label={val.label}
                    sx={{ bgcolor: val.color + "22", color: val.color, fontWeight: 700, fontSize: "0.7rem", border: `1px solid ${val.color}44` }} />
                ))}
              </Box>
            </SectionCard>

            {/* ── Medical Advisory ───────────────────────────────────── */}
            {report.medicalAdvisory && (
              <Alert severity="warning" icon={<Warning />}
                sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(230,81,0,0.1)", mb: 3, border: "1px solid #ffe082" }}>
                {report.medicalAdvisory}
              </Alert>
            )}

            {/* ── Lifestyle Guidelines ─────────────────────────── */}
            {report.recommendations && report.recommendations.length > 0 && (
              <SectionCard title="Lifestyle Guidelines" icon={<AssignmentTurnedIn />} color="#2e7d32" bg="#f1f8e9">
                <Typography variant="caption" sx={{ color: "#555", display: "block", mb: 2, fontStyle: "italic", lineHeight: 1.5 }}>
                  ⚠️ <strong>Notice:</strong> These lifestyle recommendations are generic templates inspired by Yoga Certification Board (YCB) syllabus. FitNexus is not affiliated with or endorsed by any government entity (including the Ministry of AYUSH), is not a medical diagnostic tool, and recommends consulting a doctor for any persistent symptoms.
                </Typography>
                <List>
                  {report.recommendations.map((rec, i) => (
                    <ListItem key={i} sx={{ py: 1, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}><CheckCircle sx={{ color: "#2e7d32", fontSize: 22 }} /></ListItemIcon>
                      <ListItemText primary={rec} primaryTypographyProps={{ variant: "body2", fontWeight: 500, color: "#2e7d32" }} />
                    </ListItem>
                  ))}
                </List>
              </SectionCard>
            )}

            {/* ── Wellness Mirror Summary ────────────────────────────── */}
            <SectionCard title="Wellness Mirror Summary" icon="🪞" color="#602e7d" bg="linear-gradient(135deg,#fdf8ff,#f3e5f5)">
              <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.9, mb: 2 }}>
                Namaste <strong>{report.fullName || "Friend"}</strong> Ji, welcome to your wellness reflection.
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 1 }}>
                Emotionally, you are navigating <strong>{report.mood || "—"}</strong> energy with <strong>{report.energyLevel || "—"}</strong> levels.
                Your sleep pattern is <strong>{report.sleepQuality || "—"}</strong>, with about <strong>{report.sleepHours || "—"} hours</strong> of rest.
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 1 }}>
                Your stress level is <strong>{stressLabel}</strong>, which may influence your emotional and physical balance.
                You identify as a <strong>{report.yogaExperience || "Beginner"}</strong> in yoga, helping us tailor your practice.
              </Typography>
              {report.withNature > 0 && (
                <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 1 }}>
                  You spend about <strong>{report.withNature} hours/week</strong> in nature, nurturing your environmental wellness.
                </Typography>
              )}
              {report.waterIntake > 0 && (
                <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 1 }}>
                  Your daily hydration level is registered at <strong>{report.waterIntake} Liters</strong>.
                </Typography>
              )}
              {report.restingHeartRate > 0 && (
                <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 1 }}>
                  Your registered resting heart rate is <strong>{report.restingHeartRate} BPM</strong>.
                </Typography>
              )}
              {report.chronicConditions && (
                <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 1 }}>
                  Reported conditions: <strong>{report.chronicConditions}</strong>.
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}>
                Your wellness score is <strong style={{ color: themeColor }}>{scoreVal}/10 — {statusLabel}</strong>. This reflects your overall balance across multiple dimensions.
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ color: "#602e7d", fontStyle: "italic", lineHeight: 1.7 }}>
                Based on your profile, yoga may support your journey through breath-led movement, emotional awareness, and gentle reflection.
              </Typography>
            </SectionCard>

            {/* ── Sprint 2: GenAI & Wearables Preview ───────────────── */}
            <Card sx={{ borderRadius: 4, background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)", color: "#fff", boxShadow: "0 8px 24px rgba(26,35,126,0.2)", mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  🚀 Coming Soon in Sprint 2
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, mb: 1.5 }}>
                  <strong>GenAI Personalized Narration:</strong> Soon you will receive customized, natural-language wellness reflections generated specifically for your profile.
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  <strong>Wearable Sync:</strong> Synchronize your Fitbit device to automatically import step logs, heart rate variability, and active sleep cycles.
                </Typography>
              </CardContent>
            </Card>

            {/* ── Next Step CTA ─────────────────────────────────────── */}
            <Card sx={{ borderRadius: 4, background: "linear-gradient(135deg, #054474 0%, #602e7d 100%)", color: "#fff", boxShadow: "0 8px 32px rgba(96,46,125,0.3)", mb: 3 }}>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>🌱 Your Next Step</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.7 }}>
                  If you're curious about how yoga can support your wellness journey — whether through group sessions or personalized guidance — we'd love to hear from you.
                  You don't need to be flexible or experienced. <em>You just need to begin.</em>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                  Based on your wellness insights, yoga may offer the support your body and mind are asking for. Whether you prefer a group session or a personalized practice, we're here to guide you with care and respect for your unique rhythm.
                </Typography>
                <Button
                  variant="contained"
                  href="/wellness"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: "bold", borderRadius: 3, px: 4, py: 1.2, textTransform: "none", border: "1px solid rgba(255,255,255,0.4)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
                >
                  Retake Assessment
                </Button>
              </CardContent>
            </Card>

          </Grid>
        </Grid>
        
        {/* Printable Footer */}
        <Box sx={{ mt: 6, pt: 2, borderTop: "2px solid rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", color: "#666", fontSize: "0.75rem", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>© 2026 FitNexus · Built with ❤️ for Holistic Wellness · All rights reserved.</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>github.com/komalghodke/fit-nexus-dev</Typography>
        </Box>
        </div>
      </Container>

      <WellnessChatbot userId={userId} report={report} />
    </Box>
  );
}

export default ReportsPage;
