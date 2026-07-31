import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api/apiConfig";
import { useTranslation } from "react-i18next";
import FormHelperText from "@mui/material/FormHelperText";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const moodOptions = ["Calm", "Stressed", "Anxious", "Joyful", "Sad", "Irritable", "Grateful", "Lonely", "Angry", "Hopeful"];
const sleepOptions = ["Restful", "Interrupted", "Insomnia", "LightSleep", "Oversleeping", "DreamDisturbed"];
const experienceOptions = ["Beginner", "Active", "Yoga Practitioner"];
const energyOptions = ["Balanced", "High", "Low", "Fatigued", "Hyperactive"];

const WellnessForm = () => {
  
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // ── Role guard: this form is exclusively for members (USER role) ──────────
  const currentRole = localStorage.getItem("role") || "";

  const [activeStep, setActiveStep] = useState(0);

  const [inputs, setInputs] = useState({
    fullName: "",
    email: localStorage.getItem("email") || "",
    mobileNumber: "",
    gender: "",
    city: "",
    age: "",
    height: "",
    weight: "",
    waterIntake: 2.0,
    digestiveIssues: "None",
    painArea: "None",
    mood: "",
    stressLevel: 5,
    sleep: "",
    sleepQuality: "Restful",
    sleepHours: 8,
    restingHeartRate: 72,
    innerPeace: "sometimes",
    socialSupport: "sometimes",
    workSatisfaction: 5,
    withNature: 1,
    hasDisease: false,
    workoutType: "",
    workoutDuration: 0,
    workoutFrequency: 0,
    dailyCalories: 0,
    proteinIntake: 0,
    fruitServings: 0,
    vegetableServings: 0,
    bedtime: "",
    wakeTime: "",
    stressTriggers: "",
    relaxationPractice: "",
    smoking: "No",
    alcohol: "No",
    screenTime: 4,
    physicalActivity: 30,
    meditationMinutes: 0,
    energyLevel: "Balanced",
    chronicConditions: "",
    medications: "",
    bmi: 22.0,
    yogaExperience: "Beginner",
    daysPerWeek: 0,
    minutesPerSession: 0,
    journalEntry: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (currentRole && currentRole !== "USER") {
    const roleLabel =
      currentRole === "YOGA_INSTRUCTOR" ? "Yoga Instructor" :
      currentRole === "GYM_TRAINER" ? "Gym Trainer" :
      currentRole === "ADMIN" ? "Admin" : currentRole;
    const backPath =
      currentRole === "ADMIN" ? "/admin" : "/staff";
    return (
      <Box
        sx={{
          minHeight: "80vh", display: "flex", alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf6ff 0%, #ede7f6 100%)",
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: 5, p: 2, textAlign: "center",
              boxShadow: "0 20px 60px rgba(96,46,125,0.15)",
              border: "2px solid #ede0fa",
              background: "linear-gradient(145deg, #ffffff, #faf5ff)",
            }}
          >
            <CardContent>
              <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>🚫</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#602e7d", mb: 1 }}>
                Members-Only Area
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 3, lineHeight: 1.7 }}>
                Hi <strong>{roleLabel}</strong>! The Wellness Assessment Form is designed
                exclusively for registered members to track their personal wellness journey.
                <br /><br />
                As a staff member, you can view member reports and add guidance from your dedicated portal.
              </Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}>
                📋 Member reports are accessible from the <strong>Staff Portal → Guidance tab</strong>.
              </Alert>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(backPath)}
                sx={{
                  bgcolor: "#602e7d", color: "#fff", fontWeight: 700, borderRadius: 3,
                  px: 4, py: 1.5, textTransform: "none", fontSize: "1rem",
                  "&:hover": { bgcolor: "#4a1f60" },
                }}
              >
                ← Go to My Portal
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const steps = [
    t("personalDetails"),
    t("physicalHealth"),
    t("mindEmotion"),
    t("lifestyleEnvironment")
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      const updated = {
        ...prev,
        [name]: value === "true" ? true : value === "false" ? false : value
      };
      if (name === "sleepQuality") {
        updated.sleep = value;
      }
      
      // Calculate BMI dynamically
      const w = parseFloat(name === "weight" ? value : prev.weight);
      const h = parseFloat(name === "height" ? value : prev.height);
      if (w > 0 && h > 0) {
        updated.bmi = parseFloat((w / ((h / 100) * (h / 100))).toFixed(1));
      }
      
      return updated;
    });
  };

  const handleSliderChange = (name) => (e, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Basic validation for Step 0
    if (activeStep === 0) {
      if (!inputs.fullName || !inputs.email || !inputs.mobileNumber || !inputs.gender || !inputs.city) {
        setError("Please fill out all required fields marked with *");
        return;
      }
      if (inputs.mobileNumber.length !== 10) {
        setError("Mobile number must be exactly 10 digits");
        return;
      }
    }
    setError("");
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/wellness/${userId}`, inputs, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(t("successAlert"));
      setTimeout(() => {
        navigate("/reports");
      }, 1500);
    } catch (err) {
      setError(t("failureAlert"));
      setLoading(false);
    }
  };

  // Render different fields depending on step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: "bold", mb: 2 }}>
                👤 {t("Basic Information")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t("Full Name")}
                name="fullName"
                value={inputs.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t("Email")}
                name="email"
                type="email"
                value={inputs.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label={t("Mobile No")}
                name="mobileNumber"
                inputProps={{ maxLength: 10 }}
                helperText="10 digits format"
                value={inputs.mobileNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl
                fullWidth
                required
                sx={{ minWidth: 180 }}
              >
                <InputLabel id="gender-label">Gender</InputLabel>

                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={inputs.gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label={t("City")}
                name="city"
                value={inputs.city}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: "bold", mb: 2 }}>
                📊 {t("Physical Wellness")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label={t("Age")}
                name="age"
                type="number"
                value={inputs.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label={t("Height")}
                name="height"
                type="number"
                value={inputs.height}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label={t("Weight")}
                name="weight"
                type="number"
                value={inputs.weight}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("Water Intake (liters)")}
                name="waterIntake"
                type="number"
                inputProps={{ step: "0.1" }}
                value={inputs.waterIntake}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("Resting Heart Rate")}
                name="restingHeartRate"
                type="number"
                value={inputs.restingHeartRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                disabled
                label="Calculated BMI"
                value={inputs.bmi ? inputs.bmi.toFixed(1) : "—"}
                helperText="Auto-calculated from Ht/Wt"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Digestive Issues"
                placeholder="e.g. None, Bloating, Acidity"
                helperText="Example: None, Bloating, Acidity"
                name="digestiveIssues"
                value={inputs.digestiveIssues}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chronic Pain Areas"
                placeholder="e.g. None, Back, Knees"
                helperText="Example: None, Back, Knees"
                name="painArea"
                value={inputs.painArea}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Workout Type"
                placeholder="e.g. Yoga, Gym, Walking"
                helperText="Example: Yoga, Gym, Walking"
                name="workoutType"
                value={inputs.workoutType}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Workout Duration (mins)"
                name="workoutDuration"
                type="number"
                value={inputs.workoutDuration}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Workout Frequency (times/wk)"
                name="workoutFrequency"
                type="number"
                value={inputs.workoutFrequency}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Protein Intake (grams)"
                name="proteinIntake"
                type="number"
                value={inputs.proteinIntake}
                onChange={handleChange}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Disease</InputLabel>
                <Select
                  name="hasDisease"
                  value={inputs.hasDisease}
                  label="Disease"
                  onChange={handleChange}>
                  <MenuItem value={true}>{t("Yes")}</MenuItem>
                  <MenuItem value={false}>{t("No")}</MenuItem>
                </Select>
                <FormHelperText>
                  {t("hasDisease")}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estimated Calories Burned (kcal)"
                placeholder="e.g. 300"
                helperText="Approximate value based on your physical activity today"
                name="dailyCalories"
                type="number"
                value={inputs.dailyCalories}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>            
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: "bold", mb: 2 }}>
                🧠 {t("Emotional Wellness")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Mood")}</InputLabel>
                <Select name="mood" value={inputs.mood} label={t("Mood")} onChange={handleChange}>
                  {moodOptions.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Sleep Quality")}</InputLabel>
                <Select name="sleepQuality" value={inputs.sleepQuality} label={t("Sleep Quality")} onChange={handleChange}>
                  {sleepOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Energy Level")}</InputLabel>
                <Select name="energyLevel" value={inputs.energyLevel} label={t("Energy Level")} onChange={handleChange}>
                  {energyOptions.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Inner Peace")}</InputLabel>
                <Select name="innerPeace" value={inputs.innerPeace} label={t("Inner Peace")} onChange={handleChange}>
                  <MenuItem value="yes">{t("Yes")}</MenuItem>
                  <MenuItem value="no">{t("No")}</MenuItem>
                  <MenuItem value="sometimes">{t("Sometimes")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bedtime (e.g. 10:30 PM)"
                name="bedtime"
                value={inputs.bedtime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Wake time (e.g. 6:00 AM)"
                name="wakeTime"
                value={inputs.wakeTime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("Sleep Hours")}
                name="sleepHours"
                type="number"
                value={inputs.sleepHours}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom sx={{ mt: 2 }}>
                {t("Stress Level")} (1 = Relaxed, 10 = Extemely Stressed)
              </Typography>
              <Slider
                value={inputs.stressLevel}
                onChange={handleSliderChange("stressLevel")}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                marks
                color="success"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Stress Triggers / Notes"
                name="stressTriggers"
                value={inputs.stressTriggers}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight: "bold", mb: 2 }}>
                🌿 {t("lifestyleEnvironment")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t("Social Support")}</InputLabel>
                <Select name="socialSupport" value={inputs.socialSupport} label={t("Social Support")} onChange={handleChange}>
                  <MenuItem value="yes">{t("Yes")}</MenuItem>
                  <MenuItem value="no">{t("No")}</MenuItem>
                  <MenuItem value="sometimes">{t("Sometimes")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Yoga Experience Level</InputLabel>
                <Select name="yogaExperience" value={inputs.yogaExperience} label="Yoga Experience Level" onChange={handleChange}>
                  {experienceOptions.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>{t("Work Satisfaction")} (1 = Unsatisfied, 10 = Highly Happy)</Typography>
              <Slider
                value={inputs.workSatisfaction}
                onChange={handleSliderChange("workSatisfaction")}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                marks
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>{t("Hours with Nature")} (hours/day)</Typography>
              <Slider
                value={inputs.withNature}
                onChange={handleSliderChange("withNature")}
                min={0}
                max={10}
                valueLabelDisplay="auto"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Days of Yoga practice per week"
                name="daysPerWeek"
                type="number"
                value={inputs.daysPerWeek}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minutes per Yoga session"
                name="minutesPerSession"
                type="number"
                value={inputs.minutesPerSession}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Smoking Habits? (Yes/No)"
                name="smoking"
                value={inputs.smoking}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Daily Wellness Journal / Self Reflection"
                name="journalEntry"
                placeholder="Write how you are feeling internally, spiritually, or physically today..."
                value={inputs.journalEntry}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      default:
        return "Unknown Step";
    }
  };

  return (
    <Box sx={{ background: "linear-gradient(160deg, #f8f6ff 0%, #f0f7f4 100%)", minHeight: "92vh", py: 5 }}>
    <Container maxWidth="md">
      {/* ── Hero Header ── */}
      <Box
        sx={{
          borderRadius: 4, mb: 4, p: 4,
          background: "linear-gradient(135deg, #0d2c4e 0%, #255f9a 50%, #602e7d 100%)",
          color: "#fff", boxShadow: "0 8px 28px rgba(96,46,125,0.3)"
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 900,
                lineHeight: 1.15,
                background: "linear-gradient(90deg, #ffe082 0%, #a5d6a7 50%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
              }}
            >
              🧘 {t("assessmentTitle")}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.82, mt: 1 }}>
              {t("assessmentSubtitle")}
            </Typography>
          </Box>
          {/* Language Switcher */}
          <Box sx={{ display: "flex", gap: 0.6, alignItems: "center" }}>
            {[{ code: "en", label: "EN" }, { code: "hi", label: "हिं" }, { code: "mr", label: "मरा" }].map(({ code, label }) => (
              <Button
                key={code}
                size="small"
                onClick={() => i18n.changeLanguage(code)}
                sx={{
                  minWidth: 38, px: 1, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: "0.75rem",
                  textTransform: "none",
                  bgcolor: i18n.language === code ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)",
                  color: i18n.language === code ? "#fff" : "rgba(255,255,255,0.65)",
                  border: `1px solid ${i18n.language === code ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}`,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.06)", overflow: "visible", mb: 4, background: "#ffffff" }}>
        <CardContent sx={{ p: 4 }}>
          {/* Stepper Header */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 4, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* Form Content */}
          <Box sx={{ minHeight: "300px", mb: 4 }}>{renderStepContent(activeStep)}</Box>

          {/* Wizard Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  px: 4,
                  textTransform: "none",
                  borderRadius: 2.5,
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #3498db, rgb(114, 76, 175))",
                  "&:hover": {
                    background: "linear-gradient(90deg, #2980b9, #5a3a9d)"
                  }
                }}
              >
                {loading ? "Submitting..." : t("submit")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  px: 4,
                  textTransform: "none",
                  borderRadius: 2.5,
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #3498db, rgb(114, 76, 175))",
                  "&:hover": {
                    background: "linear-gradient(90deg, #2980b9, #5a3a9d)"
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default WellnessForm;