# 🧘 FitNexus — Holistic Wellness Ecosystem

[![GitHub](https://img.shields.io/badge/GitHub-fit--nexus--dev-181717?logo=github&logoColor=white)](https://github.com/komalghodke/fit-nexus-dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://fitnexus.vercel.app)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?logo=springboot&logoColor=white)](https://fitnexus-backend-api.onrender.com)
[![.NET](https://img.shields.io/badge/.NET-8_LTS-512BD4?logo=dotnet&logoColor=white)](https://fitnexus-corporate.onrender.com)
[![MySQL](https://img.shields.io/badge/Aiven_MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://aiven.io)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Deployment](https://img.shields.io/badge/Vercel_%2B_Render-Production_Live-brightgreen)](https://fitnexus.vercel.app)

> A polyglot microservice-based **Holistic Wellness Ecosystem** that bridges ancient Indian Vedic wellness science with modern predictive AI — evaluating **27 health indicators** across **6 dimensions of wellness**.

---

## 🗂️ Project Overview

| Field | Details |
|:---|:---|
| **Project Name** | FitNexus — Holistic Wellness Ecosystem |
| **Type** | Polyglot Microservices Web Application |
| **GitHub Repo** | [github.com/komalghodke/fit-nexus-dev](https://github.com/komalghodke/fit-nexus-dev) |
| **Production App URL** | [https://fitnexus-frontend.vercel.app](https://fitnexus-frontend.vercel.app) |
| **Spring Boot API (Render)** | [https://fitnexus-backend-api.onrender.com](https://fitnexus-backend-api.onrender.com) |
| **.NET Corporate API (Render)** | [https://fitnexusdashboard.onrender.com/](https://fitnexusdashboard.onrender.com/) |
| **Database** | Aiven MySQL Cloud (SSL Mode Required) |
| **Technology Stack** | React.js 18, Java 17, Spring Boot 4, C# .NET Core 8, MySQL 8, Google Gemini AI |
| **Compliance** | Indian DPDP Act 2023, GDPR Principles |

---

## 🌐 Production Deployment Architecture (Zero-Cost Topology)

```
                      USERS
                        │
                        ▼
          https://fitnexus.vercel.app
               (React Frontend)
                  Vercel
          SSL ✓ CDN ✓ HTTPS ✓
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
   Spring Boot API                 .NET Dashboard API
        Render                   Render
   HTTPS ✓ SSL ✓                    HTTPS ✓ SSL ✓
        │                               │
        └───────────────┬───────────────┘
                        │
                        ▼
                Aiven MySQL Database
            SSL Connection Required ✓
```

| Layer | Service Provider | Plan | Live Endpoint / Connection |
|:---|:---|:---:|:---|
| **Frontend SPA** | **Vercel** | `https://fitnexus-frontend.vercel.app` |
| **Spring Boot Java API** | **Render** | `https://fitnexus-backend-api.onrender.com` |
| **.NET Corporate API** | **Render** | `https://fitnexusdashboard.onrender.com/` |
| **MySQL Database** | **Aiven Cloud** | `fitnexus-mysql-fit-nexus.j.aivencloud.com:12606` (`sslMode=REQUIRED`) |

---

## 📊 Microservices Breakdown

```
React Frontend (Port 3000 / Vercel)
      │
      ├──► Spring Boot Java API (Port 8083 / Render) ──► Aiven MySQL (`defaultdb`)
      │                                                ──► Google Gemini AI
      │
      └──► .NET Core C# API (Port 5294 / Render)     ──► Aiven MySQL (`defaultdb`)
```

| Layer | Technology & Role |
|:---|:---|
| **Frontend** | React.js 18, Material-UI v5, React Router v6, Axios, i18next, jsPDF |
| **Primary Backend API** | Java 17, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Hibernate |
| **Corporate Microservice** | C# ASP.NET Core 8 Web API (Corporate Wellness Dashboard & Metrics) |
| **Cloud Database** | Aiven MySQL 8.0 Cloud Instance with SSL Encryption & Auto Schemas |
| **AI Engine** | Google Gemini AI (`gemini-2.0-flash`) + Offline Rule-Based Fallback Engine |

---

## 🔐 Security, Authentication & Portal Isolation

- **Portal-Specific Role Validation**: Server-side verification (`portalRole`) ensures users can only log into portals matching their database role (`USER`, `YOGA_INSTRUCTOR`, `GYM_TRAINER`, `ADMIN`).
- **Admin Secret Code Verification**: Admin registration requires secret verification code (`FITNEXUS-ADMIN-2026`). Error handling guarantees invalid attempts do not trigger false session expirations.
- **Stateless JWT Security**: Requests authenticated via `Bearer <JWT>` tokens.
- **Defensive Input Validation**: Comprehensive null-safety checks and clamped metric boundaries across all logging endpoints (`Workout`, `Sleep`, `Stress`, `Nutrition`, `Wellness`).

---

## 🚀 Quick Local Development Setup

### 1. Primary Backend API (Java 17 / Spring Boot + Gradle)
```bash
cd fitnexus-backend-api
./gradlew bootRun
# Runs on http://localhost:8083
```

### 2. Corporate Microservice (C# .NET Core)
```bash
cd FitNexusDashboard
dotnet run
# Runs on http://localhost:5294
```

### 3. Frontend (React.js)
```bash
cd fitnexus-frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## ✨ Key Features

- 🧘 **YCB-Aligned Yoga Prescriptions** — personalized pose recommendations for back, neck, joint & knee pain
- 🤖 **Google Gemini AI Wellness Companion** — real-time AI guidance with 100% offline fallback
- 📊 **27-Indicator Assessment** across 6 Dimensions of Wellness
- 🔮 **7 Chakra Energy Mapping Engine**
- 📄 **Exportable PDF Wellness Reports** with branding, watermark & medical disclaimers
- 🔐 **JWT-Secured Role-Based Portals** — Member, Yoga Instructor, Gym Trainer, Admin
- 🌍 **Multi-language Support** (i18next)
- 🛡️ **DPDP Act 2023 & GDPR Compliant** Privacy Policy

---

## ⚠️ Disclaimers

> **Medical Disclaimer:** FitNexus does NOT provide medical diagnosis, medical advice, clinical treatment plans, or doctor prescriptions. All content is for educational and wellness demonstration purposes only.

> **Affiliation Disclaimer:** FitNexus is an independent academic project. It is NOT affiliated with or endorsed by the Ministry of AYUSH or the Government of India.