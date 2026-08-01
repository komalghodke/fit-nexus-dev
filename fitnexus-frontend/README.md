# 🧘 FitNexus — Frontend (React.js 18)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://fitnexus.vercel.app)
[![MUI](https://img.shields.io/badge/MUI-v5-007FFF?logo=mui&logoColor=white)](https://mui.com)
[![Vercel](https://img.shields.io/badge/Vercel-Production_Live-000000?logo=vercel&logoColor=white)](https://fitnexus.vercel.app)

> React.js 18 Single Page Application — the user-facing frontend of the FitNexus Holistic Wellness Ecosystem.

---

## 🗂️ About This Module

This module contains the **React.js frontend** for FitNexus. It integrates seamlessly with both backend microservices:

| Microservice | Local Development URL | Production Live URL (Render) |
|:---|:---|:---|
| **Spring Boot Java API** | `http://localhost:8083/api` | `https://fitnexus-backend-api.onrender.com/api` |
| **C# .NET Corporate API** | `http://localhost:5294` | `https://fitnexus-corporate.onrender.com` |

API base configuration is centralized in [`src/api/apiConfig.js`](src/api/apiConfig.js).

---

## 🔐 Portal-Based Authentication & Security

The frontend supports role-isolated login tabs (`Member`, `Yoga Instructor`, `Gym Trainer`, `Admin`):
- Sends `portalRole` to backend during login to enforce server-side portal role alignment.
- Handles registration errors (e.g. Admin secret code verification) cleanly without false session expiries.
- Intercepts 401/403 responses gracefully for active sessions.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
# App runs on http://localhost:3000
```

---

## 📦 Production Build & Vercel Deployment

```bash
# Create optimized production build
npm run build
# Output is generated in /build directory
```

### Environment Variables for Production (Vercel)

Set the following in **Vercel Dashboard Project Settings**:

| Key | Value |
|:---|:---|
| `REACT_APP_API_URL` | `https://fitnexus-backend-api.onrender.com/api` |
| `REACT_APP_CORPORATE_URL` | `https://fitnexus-corporate.onrender.com` |

---

## 🗂️ Folder Structure

```
src/
├── api/           # Axios config, Interceptors & API URLs (apiConfig.js)
├── components/    # Shared UI components (Navbar, PrivateRoute, LoginForm, RegisterForm...)
├── pages/         # Page Views (Dashboard, WellnessForm, Reports, Admin, Staff...)
├── i18n/          # Multi-language i18next support
└── App.js         # Main router with protected routes
```
