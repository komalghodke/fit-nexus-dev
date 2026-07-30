# FitNexus Backend API

## Prerequisites

- Java 17+
- MySQL
- Gradle

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd fitnexus-backend-api
```

### 2. Create your secret configuration

Copy:

```
application-secret.example.properties
```

to

```
application-secret.properties
```

### 3. Update `application-secret.properties`

Example:

```properties
DB_URL=jdbc:mysql://localhost:3306/APP
DB_USERNAME=root
DB_PASSWORD=root

SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the application

```bash
gradlew bootRun
```

or run the Spring Boot application from your IDE.

---

## Security

The file

```
application-secret.properties
```

contains database credentials and API keys.

It is ignored by Git using `.gitignore` and **must not be committed**.

Use

```
application-secret.example.properties
```

as a template when setting up the project on a new machine.