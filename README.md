# 💰 FinTrack

A modern full-stack personal finance manager built with Next.js, TypeScript and PostgreSQL.

---

## 🧠 Overview

FinTrack is a scalable web application that allows users to manage their personal finances efficiently.

Users can:

- Register income and expenses
- Classify transactions by custom categories
- Visualize their financial balance
- Analyze spending patterns with interactive charts

This project demonstrates professional full-stack architecture, secure authentication with JWT, relational database design, and clean code practices.

---

## 🛠 Tech Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts

### Backend

- Next.js API Routes
- JWT Authentication
- Drizzle ORM

### Database

- PostgreSQL

### Other Tools

- Git
- ESLint

---

## 🗄 Database Architecture

Relational data model:

- **Users**
- **Categories** (belongs to user)
- **Transactions** (belongs to user and category)

Proper foreign key relationships ensure data integrity and scalability.

---

## 🔐 Authentication

- Secure password hashing using bcrypt
- JWT-based authentication
- Login with email or username
- Protected routes using middleware
- User-specific data access

---

## 📦 Features

### Authentication

- [x] User registration
- [x] Login with email or username
- [x] JWT generation
- [x] Protected routes

### Transactions

- [x] Create transaction (income / expense)
- [x] Edit transaction
- [x] Delete transaction
- [x] Filter by type (all / income / expense)

### Categories

- [x] Create category with icon and color
- [x] Edit category
- [x] Delete category

### Dashboard

- [x] Monthly balance overview
- [x] Total income and expenses
- [x] Recent transactions

### Statistics

- [x] Expenses by category (pie chart)
- [x] Monthly income vs expenses (bar chart)
- [x] Balance trend (area chart)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fintrack.git
cd fintrack
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fintrack
JWT_SECRET=your_super_secret_key
```

4. Create the database:

```sql
CREATE DATABASE fintrack;
```

5. Run migrations:

```bash
npm run db:migrate
```

6. Seed the database:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_key
```

⚠️ Never commit your `.env.local` file.

---

## 📁 Project Structure

```
fintrack/
├── app/
│   ├── (auth)/          # Login and register pages
│   ├── (dashboard)/     # Protected dashboard pages
│   └── api/             # API routes
├── components/
│   ├── categories/
│   ├── layout/
│   ├── statistics/
│   ├── transactions/
│   └── ui/
├── db/
│   ├── index.ts         # Database client
│   ├── schema.ts        # Drizzle schema
│   └── seed.ts          # Seed data
├── hooks/               # Custom React hooks
├── lib/                 # Auth and middleware utilities
└── types/               # Shared TypeScript types
```

---

## 🎯 Purpose of This Project

This project was built to demonstrate professional full-stack development skills, including:

- Modern React architecture with Next.js App Router
- Backend API design with protected endpoints
- Relational database modeling with Drizzle ORM
- Authentication systems with JWT
- Data visualization with Recharts
- Clean project structure and reusable components
- Scalable application patterns

---

## 📌 Author

Amadeo Siles  
Full Stack Developer
