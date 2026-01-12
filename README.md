# 🎨 Financial Transaction Parser - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

A modern, responsive user interface for managing and parsing financial transactions.

## ✨ Features

- **🔐 Secure Auth:** Integrated with Better Auth for seamless login and organization management.
- **🏢 Multi-Tenancy:** Easily switch between organizations.
- **📝 Smart Parsing:** Raw text input parsing into structured transaction data.
- **📊 Activity View:** Paginated history of all transactions.
- **🌙 Dark Mode:** Modern aesthetics with light/dark support.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Backend running on `http://localhost:3001`

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3001/api/auth"
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔄 Transaction Parsing Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant API as Backend API
    participant DB

    User->>Dashboard: Paste raw transaction text
    User->>Dashboard: Click "Parse & Save"
    Dashboard->>API: POST /api/transactions/extract
    Note right of API: NLP/Regex Parsing Logic
    API->>DB: Save to Org Scoped Table
    DB-->>API: Success
    API-->>Dashboard: Return JSON (Amount, Date, Desc)
    Dashboard-->>User: Update Table & Show Toast
```

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Shadcn/UI).
- `lib/`: Utility functions and API client.
- `hooks/`: Custom React hooks for data fetching.
```
