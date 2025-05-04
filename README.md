# Backend Service

This is a backend service built with **Node.js**, **TypeScript**, and **Express**, using **Drizzle ORM** for PostgreSQL integration. The project follows a modular and maintainable structure suitable for scalable applications.

## 🚀 Features

- TypeScript support
- Express server
- PostgreSQL integration via Drizzle ORM
- Input validation using Zod
- Environment variable management with dotenv
- Dev experience powered by ts-node-dev

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone  https://github.com/wardSultan/MolhamTeamBackend.git
   cd backend
   ```

## 📦 Installation dependencies

    npm install

## 📦 Create .env file

    Create a .env file in the root directory and add your environment variables. Example
    DATABASE_URL=postgresql://username:password@localhost:5432/your_database
    PORT=3000

## 🛠️ Development

    To start the development server with auto-reloading :
    npm run dev

## 📁 Project Structure (Suggested)

    src/
    │
    ├── app.ts          # Entry point
    ├── routes/         # Define all routes
    ├── controllers/    # Route handlers
    ├── services/       # Business logic
    ├── config/db             # Drizzle ORM setup
    ├── models/        # Zod validation schemas
    └── utils/          # Utility functions
