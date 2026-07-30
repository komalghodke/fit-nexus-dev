# 🧘 FitNexus — Frontend (React.js 18)

[![GitHub](https://img.shields.io/badge/GitHub-fit--nexus--dev-181717?logo=github&logoColor=white)](https://github.com/komalghodke/fit-nexus-dev)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MUI](https://img.shields.io/badge/MUI-v5-007FFF?logo=mui&logoColor=white)

> React.js 18 Single Page Application — the user-facing frontend of the FitNexus Holistic Wellness Ecosystem.

---

## 🗂️ About This Module

This folder contains the **React.js frontend** for FitNexus. It connects to two backend microservices:

| Microservice | Local URL | Production URL |
|:---|:---|:---|
| Spring Boot Java API | `http://localhost:8083` | `https://fitnexus-api-java.azurewebsites.net` |
| C# .NET Corporate API | `http://localhost:5294` | `https://fitnexus-dotnet.azurewebsites.net` |

API base URL is configured in [`src/api/apiConfig.js`](src/api/apiConfig.js).

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm start
# App runs on http://localhost:3000
```

---

## 📦 Production Build

```bash
npm run build
# Output goes to /build folder
```

---

## 🗂️ Project Structure

```
src/
├── api/           # Axios config & API base URL (apiConfig.js)
├── components/    # Shared components (Navbar, PrivateRoute, LoginForm...)
├── pages/         # All page components (Dashboard, About, Reports, Admin...)
├── i18n/          # Multi-language support (i18next)
└── App.js         # Root component with React Router routes
```

---

## ☁️ Azure Deployment

See full deployment guide: [`../Exec/plans/azure_free_deployment_guide_28July.md`](../Exec/plans/azure_free_deployment_guide_28July.md)

**Before deploying**, update `src/api/apiConfig.js`:
```js
// Change this line to your live Azure API URL
export const API_URL = "https://fitnexus-api-java.azurewebsites.net/api";
```
