import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WellnessProvider } from "./context/WellnessContext";

import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import WorkoutForm from "./pages/WorkoutForm";
import NutritionForm from "./pages/NutritionForm";
import SleepForm from "./pages/SleepForm";
import StressForm from "./pages/StressForm";
import Footer from "./components/Footer";

function App() {
  return (
    <WellnessProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/workout" element={<WorkoutForm />} />
          <Route path="/nutrition" element={<NutritionForm />} />
          <Route path="/sleep" element={<SleepForm />} />
          <Route path="/stress" element={<StressForm />} />
        </Routes>
        <Footer />
      </Router>
    </WellnessProvider>
  );
}

export default App;
