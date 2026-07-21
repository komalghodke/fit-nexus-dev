# fit-nexus-dev

FIT‑NEXUS: A wellness tracking platform with predictive AI scoring and GenAI narration, corporate dashboards, maps.

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Gradle

### Frontend
- React.js
- Material UI
- Axios

### Database
- MySQL

---

# Prerequisites

Install the following:

- Java JDK 17+
- Node.js (LTS)
- npm
- MySQL Server 8+
- Git
- Eclipse / IntelliJ IDEA (Backend)
- VS Code (Frontend)

---

# Clone Repository

```bash
git clone https://github.com/<your-username>/fit-nexus-dev.git
cd fit-nexus-dev
```

---

# Backend Setup

Backend project location:

```text
fitnexus-backend-api
```

## Import into Eclipse

1. Open Eclipse
2. File → Import
3. Gradle → Existing Gradle Project
4. Select the `fitnexus-backend-api` folder
5. Click Finish
6. Wait for Gradle dependencies to download

---

## Configure Secrets

Copy

```text
application-secret.example.properties
```

to

```text
application-secret.properties
```

Update the values.

Example:

```properties
DB_URL=jdbc:mysql://localhost:3306/YOUR_DATABASE
DB_USERNAME=your_username
DB_PASSWORD=your_password

SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** `application-secret.properties` is ignored by Git and should never be committed.

---

## Create Database

Open MySQL and run:

```sql
CREATE DATABASE YOUR_DATABASE;
```

Spring Boot will automatically create all required tables using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## Run Backend (Eclipse)

Right-click the project

```
Run As → Spring Boot App
```

or

```
Run As → Java Application
```

Select:

```
FitnexusBackendApiApplication
```

Backend URL:

```
http://localhost:8083
```

---

## Run Backend (Command Prompt)

Open Command Prompt inside:

```text
fitnexus-backend-api
```

Build:

```bash
gradlew clean build
```

Run:

```bash
gradlew bootRun
```

Create executable JAR:

```bash
gradlew clean build
```

Run the JAR:

```bash
java -jar build/libs/<jar-file>.jar
```

---

# Frontend Setup

Frontend project:

```text
fitnexus-frontend
```

---

## Open in VS Code

```bash
cd fitnexus-frontend
code .
```

or

Open VS Code → File → Open Folder → `fitnexus-frontend`

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

Frontend URL:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

---

# Running the Complete Application

1. Start MySQL Server
2. Run the Backend (`localhost:8083`)
3. Run the Frontend (`localhost:3000`)
4. Open:

```
http://localhost:3000
```

---

# Database

Create the database:

```sql
CREATE DATABASE YOUR_DATABASE;
```

Since the project uses Hibernate:

```properties
spring.jpa.hibernate.ddl-auto=update
```

all tables are created automatically.

No SQL schema file is required.

---

# Sample Data

This repository does not include database records.

After running the application:

- Register a new account
- Log in
- Submit wellness information
- Explore reports and dashboards

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
└── README.md
```

---

# Security

Sensitive information is stored in:

```
application-secret.properties
```

This file is excluded from Git using `.gitignore`.

Use:

```
application-secret.example.properties
```

as a template.

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

Test

```bash
gradlew test
```

---

## Frontend

Install packages

```bash
npm install
```

Start development server

```bash
npm start
```

Build production

```bash
npm run build
```

Run tests

```bash
npm test
```

---

# Default URLs

Backend

```
http://localhost:8083
```

Frontend

```
http://localhost:3000
```