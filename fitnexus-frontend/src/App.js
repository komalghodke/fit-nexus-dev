import React from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <div>
      <h1>FitNexus Phase 1</h1>
      <RegisterForm />
      <LoginForm />
      <ProfilePage />
    </div>
  );
}

export default App;