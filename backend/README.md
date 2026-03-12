# Heirrati Backend API

Node.js + Express + MongoDB backend for the hiring platform.

## Tech Stack

- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Strong secret (min 32 chars)
   - `FRONTEND_URL` - For CORS (e.g. http://localhost:5173)

3. **Start MongoDB** (local or use MongoDB Atlas)

4. **Seed database** (optional)
   ```bash
   npm run seed
   ```

5. **Run server**
   ```bash
   npm run dev    # Development with watch
   npm start      # Production
   ```

## Test Credentials (after seed)

- **Admin:** admin@heirrati.com / password123
- **Recruiter:** jane@techcorp.com / password123

## API Base URL

`http://localhost:5000/api`

See [API.md](./API.md) for full documentation.

## Project Structure

```
backend/
├── config/       # Database config
├── controllers/  # Route handlers
├── middleware/   # Auth, error handling
├── models/       # Mongoose schemas
├── routes/       # API routes
├── scripts/      # Seed script
├── utils/        # Analytics helpers
└── server.js     # Entry point
```
