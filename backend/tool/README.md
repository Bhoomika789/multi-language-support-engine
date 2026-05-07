# Tool-85 Multi-Language Support Engine

## Overview

Tool-85 is a full-stack Java Spring Boot + React application developed as a capstone internship project.

The system supports:
- Record Management
- JWT Authentication
- Dashboard Analytics
- CSV Export
- File Upload
- Email Notifications
- Audit Logging
- Swagger API Docs
- Responsive UI

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- JWT
- Flyway
- PostgreSQL

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- Recharts

---

## Features

- CRUD Operations
- Search & Filter
- Pagination
- Dashboard KPI Cards
- Responsive Design
- CSV Export
- File Upload
- Swagger UI
- Email Notifications
- Audit Logging (AOP)
- MockMvc Testing

---

## Backend Setup

```bash
cd backend/tool
.\mvnw.cmd spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

Swagger:

```bash
http://localhost:8080/swagger-ui/index.html
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## Database

PostgreSQL Database:

```bash
tool_db
```

Flyway migrations are inside:

```bash
src/main/resources/db/migration
```

---

## Security

- JWT Authentication
- Spring Security
- Role-based Access
- Audit Logging
- Email Notification Alerts

---

## Developed By
Bhoomika N
Internship Capstone Project
Java Developer 2 Role