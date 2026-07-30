# 🧘 FitNexus — Holistic Wellness Ecosystem

[![GitHub](https://img.shields.io/badge/GitHub-fit--nexus--dev-181717?logo=github&logoColor=white)](https://github.com/komalghodke/fit-nexus-dev)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?logo=springboot&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-8_LTS-512BD4?logo=dotnet&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?logo=google&logoColor=white)

> A polyglot microservice-based **Holistic Wellness Ecosystem** that bridges ancient Indian Vedic wellness science with modern predictive AI — evaluating **27 health indicators** across **6 dimensions of wellness**.

---

## 🗂️ Project Overview

| Field | Details |
|:---|:---|
| **Project Name** | FitNexus — Holistic Wellness Ecosystem |
| **Type** | Polyglot Microservices Web Application |
| **GitHub** | [github.com/komalghodke/fit-nexus-dev](https://github.com/komalghodke/fit-nexus-dev) |
| **Technology Stack** | React.js 18, Java 17, Spring Boot 4, C# .NET Core 8, MySQL, Google Gemini AI |
| **Compliance** | Indian DPDP Act 2023, GDPR Principles |

---

## 📊 System Architecture & Stack

```
React Frontend (Port 3000)
      │
      ├──► Spring Boot Java API (Port 8083)  ──► MySQL (fitnexusdb)
      │                                       ──► Google Gemini AI
      │
      └──► .NET Core C# API (Port 5294)
```

| Layer | Technology |
|:---|:---|
| **Frontend** | React.js 18, Material-UI v5, React Router v6, Axios, i18next, jsPDF |
| **Primary Backend API** | Java 17, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Hibernate |
| **Corporate Microservice** | C# ASP.NET Core 8 Web API |
| **Database** | MySQL (`fitnexusdb`) |
| **AI Engine** | Google Gemini AI (gemini-2.0-flash) + Offline Rule-Based Fallback |

---

## 🚀 Quick Local Development Setup

### 1. Frontend (React.js)
```bash
cd fitnexus-frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 2. Primary Backend API (Java 17 / Spring Boot + Gradle)
```bash
cd fitnexus-backend-api
.\gradlew.bat bootRun
# Runs on http://localhost:8083
```

### 3. Corporate Microservice (C# .NET Core)
```bash
cd FitNexusDashboard
dotnet run
# Runs on http://localhost:5294
```

---

## ☁️ Azure Cloud Deployment

| Component | Cloud Service | Cost |
|:---|:---|:---:|
| **React Frontend** | Azure Static Web Apps (Free) |
| **Spring Boot API** | Azure App Service F1 Free Tier |
| **C# .NET API** | Azure App Service F1 Free Tier |
| **MySQL Database** | Aiven for MySQL (Free Plan) |
| | **Total / Month** |

---

## ✨ Key Features

- 🧘 **YCB-Aligned Yoga Prescriptions** — personalized poses for back, neck, joint & knee pain
- 🤖 **Google Gemini AI Wellness Companion** — with 100% offline fallback
- 📊 **27-Indicator Assessment** across 6 Dimensions of Wellness
- 🔮 **7 Chakra Energy Mapping Engine**
- 📄 **Exportable PDF Wellness Reports** with watermark & disclaimers
- 🔐 **JWT-Secured Role-Based Portals** — Member, Yoga Instructor, Gym Trainer, Admin
- 🌍 **Multi-language Support** (i18next)
- 🛡️ **DPDP Act 2023 & GDPR Compliant** Privacy Policy

---

## ⚠️ Disclaimers

> **Medical Disclaimer:** FitNexus does NOT provide medical diagnosis, medical advice, clinical treatment plans, or doctor prescriptions. All content is for educational and wellness demonstration purposes only.

> **Affiliation Disclaimer:** FitNexus is an independent academic project. It is NOT affiliated with or endorsed by the Ministry of AYUSH or the Government of India.