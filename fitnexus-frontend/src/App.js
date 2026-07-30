import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WellnessProvider } from "./context/WellnessContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { PrivateRoute, StaffRoute, AdminRoute } from "./components/PrivateRoute";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import WorkoutForm from "./pages/WorkoutForm";
import NutritionForm from "./pages/NutritionForm";
import SleepForm from "./pages/SleepForm";
import StressForm from "./pages/StressForm";
import WellnessForm from "./pages/WellnessForm";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import FeedbackPage from "./pages/FeedbackPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import "./App.css";

function App() {
  return (
    <WellnessProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* Protected – any authenticated user */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/reports"   element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
          <Route path="/workout"   element={<PrivateRoute><WorkoutForm /></PrivateRoute>} />
          <Route path="/nutrition" element={<PrivateRoute><NutritionForm /></PrivateRoute>} />
          <Route path="/sleep"     element={<PrivateRoute><SleepForm /></PrivateRoute>} />
          <Route path="/stress"    element={<PrivateRoute><StressForm /></PrivateRoute>} />
          <Route path="/wellness"  element={<PrivateRoute><WellnessForm /></PrivateRoute>} />
          <Route path="/wellness-form" element={<PrivateRoute><WellnessForm /></PrivateRoute>} />
          <Route path="/map"       element={<PrivateRoute><MapPage /></PrivateRoute>} />

          {/* Staff-only route */}
          <Route path="/staff" element={<StaffRoute><StaffDashboard /></StaffRoute>} />

          {/* Admin-only route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </WellnessProvider>
  );
}

export default App;