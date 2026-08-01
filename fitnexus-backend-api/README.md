# ☕ FitNexus Primary Backend API (Spring Boot 4 / Java 17)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?logo=springboot&logoColor=white)](https://fitnexus-backend-api.onrender.com)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Render](https://img.shields.io/badge/Render-Production_Live-46E3B7?logo=render&logoColor=white)](https://fitnexus-backend-api.onrender.com)

> Core RESTful API backend microservice built with **Java 17 & Spring Boot 4**, providing health logging, report generation, JWT authentication, and AI evaluation engines.

---

## 🗂️ Features & Endpoints

- **`/api/auth`**: Portal-secured authentication (`/login` with `portalRole` validation, `/register` with Admin code verification).
- **`/api/wellness`**: AYUSH/YCB aligned wellness evaluation across 27 metrics.
- **`/api/reports`**: Personalised PDF & JSON report generation.
- **`/api/workout`, `/api/sleep`, `/api/stress`, `/api/nutrition`**: Null-safe, clamped-input daily activity tracking endpoints.

---

## 🔐 Security & Validation Standards

- **Portal Role Verification**: Validates that user DB roles match requested portal roles (`USER`, `YOGA_INSTRUCTOR`, `GYM_TRAINER`, `ADMIN`).
- **Defensive Data Input Guard**: Automatic null checks and metric bounds validation across all incoming payloads.
- **Stateless JWT Security**: Spring Security filter chain with Bearer token authentication.

---

## 🛠️ Environment Configuration

Copy `application-secret.example.properties` to `application-secret.properties`:

```properties
DB_URL=jdbc:mysql://fitnexus-mysql-fit-nexus.j.aivencloud.com:12606/defaultdb?sslMode=REQUIRED
DB_USERNAME=avnadmin
DB_PASSWORD=YOUR_AIVEN_PASSWORD

SERPAPI_KEY=YOUR_SERPAPI_KEY
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

---

## 🚀 Local Execution

```bash
# Build and run with Gradle
./gradlew bootRun
# Service listens on http://localhost:8083
```

---

## ☁️ Render Production Deployment

Deploy on **Render FREE**:
- **Build Command**: `./gradlew bootJar`
- **Start Command**: `java -jar build/libs/fitnexus-backend-api-0.0.1-SNAPSHOT.jar`
- **Live URL**: `https://fitnexus-backend-api.onrender.com`