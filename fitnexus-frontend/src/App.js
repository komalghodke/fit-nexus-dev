import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WellnessProvider } from "./context/WellnessContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { PrivateRoute, UserRoute, StaffRoute, AdminRoute } from "./components/PrivateRoute";

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

          {/* Protected Member routes */}
          <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
          <Route path="/profile"   element={<UserRoute><ProfilePage /></UserRoute>} />
          <Route path="/reports"   element={<UserRoute><ReportsPage /></UserRoute>} />
          <Route path="/workout"   element={<UserRoute><WorkoutForm /></UserRoute>} />
          <Route path="/nutrition" element={<UserRoute><NutritionForm /></UserRoute>} />
          <Route path="/sleep"     element={<UserRoute><SleepForm /></UserRoute>} />
          <Route path="/stress"    element={<UserRoute><StressForm /></UserRoute>} />
          <Route path="/wellness"  element={<UserRoute><WellnessForm /></UserRoute>} />
          <Route path="/wellness-form" element={<UserRoute><WellnessForm /></UserRoute>} />
          <Route path="/map"       element={<UserRoute><MapPage /></UserRoute>} />

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