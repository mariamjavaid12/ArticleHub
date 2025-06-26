# 📰 Article Management System

A full-stack multilingual Article Management System built with **React (MUI)**, **ASP.NET Core Web API**, and **SQL Server**. It supports multiple user roles (Admin, Editor, Author), multilingual article versions, approval workflows, and JWT-based authentication.

---

## 🚀 Features

### ✅ Authentication & Authorization
- User roles: `Admin`, `Editor`, `Author`
- Secure login/signup with **JWT**
- Protected frontend routes based on role

### 📄 Article & Version Management
- Authors can:
  - Create new articles
  - Add/edit versions in multiple languages (e.g. English, Urdu, French)
  - Submit versions for review
- Editors can:
  - View all pending versions
  - Approve or reject with remarks
- Admins can:
  - Manage all users and articles

### 🌐 Multilingual Support
- Language dropdown (e.g., English, Urdu, French)
- Versioned content per language per article
- Unicode/RTL-compatible UI

### 📊 Tech Stack

| Layer         | Tech                             |
|---------------|----------------------------------|
| Frontend      | React, React Router, MUI         |
| Backend       | ASP.NET Core 8.0 Web API         |
| Auth          | JWT, ASP.NET Identity             |
| Database      | SQL Server + EF Core (Code-First) |
| Testing       | xUnit (API), Jest (Frontend)     |

---
