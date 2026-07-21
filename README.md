# FitNexus

FitNexus is a full-stack Corporate Wellness Management System that enables users to monitor their physical and mental wellness, receive AI-powered wellness insights, explore nearby wellness centers through Google Maps integration, and provides organizations with a corporate analytics dashboard for monitoring employee wellness trends.

---

# Technology Stack

## Frontend
- React.js (Web Application)
- React Native (Mobile Application)

## Backend
- Spring Boot (Java REST API)
- ASP.NET Core (.NET 9) – Corporate Dashboard

## Database
- MySQL

## Security
- JWT Authentication

## APIs
- Google Gemini API
- Google Maps API
- SERP API
- Fitbit API *(Planned)*

## Tools
- Gradle
- Docker
- Postman
- Git
- GitHub

---

# Features

- User Registration & Login
- JWT Authentication
- Comprehensive Wellness Assessment
- AI-based Wellness Score Prediction
- AI-generated Personalized Wellness Narration
- Nutrition Tracking
- Sleep Tracking
- Workout Tracking
- Stress Monitoring
- Wellness Report Generation
- Google Maps Integration
- Corporate Analytics Dashboard
- Multi-language Support
- RESTful API Architecture
- Responsive Web Application

---

# System Requirements

## Operating System

- Windows 10 / 11
- macOS
- Linux

## Runtime Requirements

- Java Development Kit (JDK) 17+
- Node.js v18+
- .NET SDK 9.0

## Database

- MySQL Server 8.0+

## Development Tools

- Eclipse IDE / IntelliJ IDEA
- Visual Studio Code
- Visual Studio 2022
- Git
- Postman
- Docker *(Optional)*

---

# Clone Repository

```bash
git clone https://github.com/<your-username>/fit-nexus-dev.git
cd fit-nexus-dev
```

---

# Project Structure

```text
fit-nexus-dev
│
├── fitnexus-backend-api
│   ├── src
│   ├── build.gradle
│   ├── application.properties
│   ├── application-secret.properties
│   ├── application-secret.example.properties
│   └── .gitignore
│
├── fitnexus-frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── .gitignore
│
├── fitnexus-corporate-dashboard
│
└── README.md
```

---

# Backend Setup (Spring Boot)

Backend Project

```text
fitnexus-backend-api
```

## Import into Eclipse

1. Open Eclipse.
2. Select **File → Import**.
3. Select **Gradle → Existing Gradle Project**.
4. Browse to:

```text
fitnexus-backend-api
```

5. Click **Finish**.
6. Wait until Gradle downloads all dependencies.

---

## Configure Secrets

Copy

```text
application-secret.example.properties
```

Rename it to

```text
application-secret.properties
```

Update the following values.

```properties
DB_URL=jdbc:mysql://localhost:3306/YOUR_DATABASE
DB_USERNAME=your_username
DB_PASSWORD=your_password

SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** `application-secret.properties` is ignored by Git and must never be committed.

---

## Create Database

Open MySQL and execute

```sql
CREATE DATABASE YOUR_DATABASE;
```

Spring Boot will automatically create all required tables because

```properties
spring.jpa.hibernate.ddl-auto=update
```

is enabled.

---

## Run Backend from Eclipse

Right Click Project

```
Run As
    Spring Boot App
```

or

```
Run As
    Java Application
```

Select

```
FitnexusBackendApiApplication
```

Backend URL

```
http://localhost:8083
```

---

## Run Backend from Command Prompt

Open terminal inside

```text
fitnexus-backend-api
```

Build

```bash
gradlew clean build
```

Run

```bash
gradlew bootRun
```

---

## Create Executable JAR

```bash
gradlew clean build
```

Generated file

```text
build/libs/
```

Run

```bash
java -jar build/libs/<jar-file-name>.jar
```

---

# Frontend Setup (React)

Frontend Project

```text
fitnexus-frontend
```

## Open in VS Code

```bash
cd fitnexus-frontend
code .
```

or

Open VS Code

```
File
    Open Folder
```

Select

```text
fitnexus-frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Frontend

```bash
npm start
```

Frontend URL

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

Production build is generated inside

```text
build/
```

---

# Corporate Dashboard (.NET)

Project Folder

```text
fitnexus-corporate-dashboard
```

## Open in Visual Studio 2022

1. Open Visual Studio 2022.
2. Click **Open a Project or Solution**.
3. Select the `fitnexus-corporate-dashboard` project.

---

## Restore Packages

```bash
dotnet restore
```

---

## Build

```bash
dotnet build
```

---

## Run

```bash
dotnet run
```

or simply press

```
F5
```

---

## Publish

```bash
dotnet publish -c Release
```

---

# Running the Complete Application

### Step 1

Start MySQL Server.

### Step 2

Run Spring Boot Backend.

```
http://localhost:8083
```

### Step 3

Run React Frontend.

```
http://localhost:3000
```

### Step 4 *(Optional)*

Run the ASP.NET Core Corporate Dashboard.

### Step 5

Open

```
http://localhost:3000
```

---

# Database

Create database

```sql
CREATE DATABASE YOUR_DATABASE;
```

Hibernate automatically creates all required tables using

```properties
spring.jpa.hibernate.ddl-auto=update
```

No SQL schema file is required.

---

# Sample Data

This repository does not include sample database records.

After starting the application:

- Register a new account
- Login
- Complete the Wellness Assessment
- Generate Wellness Reports
- View Corporate Dashboard
- Search Nearby Yoga Studios

---

# Security

Sensitive information including

- Database Credentials
- Gemini API Key
- SERP API Key

is stored inside

```text
application-secret.properties
```

This file is excluded from Git using `.gitignore`.

Only

```text
application-secret.example.properties
```

is committed as a template.

---

# Useful Commands

## Backend

Build

```bash
gradlew clean build
```

Run

```bash
gradlew bootRun
```

Clean

```bash
gradlew clean
```

Run Tests

```bash
gradlew test
```

---

## Frontend

Install

```bash
npm install
```

Run

```bash
npm start
```

Build

```bash
npm run build
```

Test

```bash
npm test
```

---

## Corporate Dashboard (.NET)

Restore

```bash
dotnet restore
```

Build

```bash
dotnet build
```

Run

```bash
dotnet run
```

Publish

```bash
dotnet publish -c Release
```

---

# Default URLs

## Backend

```
http://localhost:8083
```

## Frontend

```
http://localhost:3000
```

---

# Future Enhancements

- Fitbit API Integration
- Wearable Device Synchronization
- AI Health Recommendations
- Cloud Deployment (AWS / Azure)
- Docker Deployment
- CI/CD Pipeline
- Push Notifications
- Advanced Analytics Dashboard

---

# License

This project is developed for educational and research purposes under CDAC PGCP-AC.