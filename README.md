````markdown
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
- Fitbit API (Planned)

## Tools
- Gradle
- Docker
- Postman
- Git
- GitHub

---

# Features

- User Registration & Login
- JWT Authentication & Authorization
- Comprehensive Wellness Assessment
- AI-based Wellness Score Prediction
- AI-generated Personalized Wellness Narration
- Nutrition Tracking
- Sleep Tracking
- Workout Tracking
- Stress Monitoring
- Wellness Report Generation
- Google Maps Integration for Nearby Yoga Studios
- Corporate Analytics Dashboard
- Multi-language Support
- Responsive Web Application
- RESTful API Architecture

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

- Eclipse IDE or IntelliJ IDEA
- Visual Studio Code
- Visual Studio 2022
- Git
- Postman
- Docker (Optional)

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
│
├── fitnexus-frontend
│
├── fitnexus-corporate-dashboard
│
└── README.md
```

---

# Backend Setup (Spring Boot)

Project Location

```text
fitnexus-backend-api
```

---

## Import into Eclipse

1. Open Eclipse.
2. Select **File → Import**.
3. Choose **Gradle → Existing Gradle Project**.
4. Browse and select:

```text
fitnexus-backend-api
```

5. Click **Finish**.
6. Wait for Gradle to download all required dependencies.

---

# Configure Application Secrets

Copy

```text
application-secret.example.properties
```

Rename it as

```text
application-secret.properties
```

Update the file:

```properties
DB_URL=jdbc:mysql://localhost:3306/YOUR_DATABASE
DB_USERNAME=your_username
DB_PASSWORD=your_password

SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** `application-secret.properties` is excluded from Git using `.gitignore` and should never be committed.

---

# Create Database

Open MySQL and execute:

```sql
CREATE DATABASE YOUR_DATABASE;
```

No tables need to be created manually.

Hibernate automatically creates all tables because:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# Run Backend (Eclipse)

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

Backend starts on

```
http://localhost:8083
```

---

# Run Backend (Command Prompt)

Open terminal inside

```text
fitnexus-backend-api
```

Build project

```bash
gradlew clean build
```

Run project

```bash
gradlew bootRun
```

---

# Create Executable JAR

```bash
gradlew clean build
```

Generated JAR

```text
build/libs/
```

Run

```bash
java -jar build/libs/<jar-file-name>.jar
```

---

# Frontend Setup (React)

Project Folder

```text
fitnexus-frontend
```

---

## Open in VS Code

Open terminal

```bash
cd fitnexus-frontend
code .
```

OR

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

# Install Dependencies

```bash
npm install
```

---

# Run React Application

```bash
npm start
```

Application runs on

```
http://localhost:3000
```

---

# Production Build

```bash
npm run build
```

Generated production build

```text
build/
```

---

# Corporate Dashboard (.NET)

Project Folder

```text
fitnexus-corporate-dashboard
```

---

## Open in Visual Studio 2022

1. Open Visual Studio 2022.
2. Click **Open a Project or Solution**.
3. Select the `fitnexus-corporate-dashboard` project.

---

## Restore Packages

Open terminal inside the project.

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

The Corporate Dashboard will start on the configured ASP.NET Core port.

---

# Running the Complete Application

## Step 1

Start MySQL Server.

---

## Step 2

Run the Spring Boot Backend.

```
http://localhost:8083
```

---

## Step 3

Run the React Frontend.

```
http://localhost:3000
```

---

## Step 4

(Optional)

Run the ASP.NET Core Corporate Dashboard.

---

## Step 5

Open the browser.

```
http://localhost:3000
```

---

# Database

Create the database

```sql
CREATE DATABASE YOUR_DATABASE;
```

Since Hibernate is enabled,

```properties
spring.jpa.hibernate.ddl-auto=update
```

all required tables will be generated automatically.

No SQL schema file is required.

---

# Sample Data

This repository does **not** include database records.

After running the application:

- Register a new account.
- Login.
- Complete the Wellness Assessment.
- Explore Wellness Reports.
- View Corporate Dashboard.
- Search Nearby Yoga Studios.

---

# Security

Sensitive information such as

- Database Credentials
- Gemini API Key
- SERP API Key

is stored in

```text
application-secret.properties
```

This file is ignored by Git.

Only

```text
application-secret.example.properties
```

is committed to the repository as a template.

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

Install Packages

```bash
npm install
```

Run Development Server

```bash
npm start
```

Create Production Build

```bash
npm run build
```

Run Tests

```bash
npm test
```

---

## Corporate Dashboard (.NET)

Restore Packages

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
- Smartwatch Data Synchronization
- Email Notifications
- AI Health Recommendations
- Advanced Analytics
- Docker Deployment
- Cloud Deployment (AWS/Azure)
- CI/CD Pipeline
- Mobile Push Notifications

---

# License

This project is developed for educational and research purposes.
````
