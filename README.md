# Simple Property Management System — SQL + Express + React + Tailwind

Roles: Admin, Owner, Tenant

## Tech Stack
- Frontend: React (Vite), React Router, Tailwind CSS, Axios
- Backend: Node, Express, PostgreSQL (pg), express-session, connect-pg-simple, bcrypt, dotenv, cors
- Auth: Session + Cookies (NO JWT)

## Project Structure
```
/server
  /controllers
  /routes
  /models
  /middleware
  /sql
  db.js
  app.js
/client
  /src
    /pages
    /components
    /context
    /api
    App.jsx
    index.jsx
```

## Prerequisites
- Node 18+
- PostgreSQL 13+

## Setup
1) Clone or copy this folder.
2) Create database in Postgres:
```
createdb property_management
```
3) Create tables:
```
psql -d property_management -f server/sql/create_tables.sql
```
4) Copy `.env.example` to `.env` and adjust values if needed.
5) Install dependencies:
```
cd server
npm install
cd ../client
npm install
```
6) Seed admin user:
```
cd ../server
node seed.js
```
7) Start servers:
- Backend: `npm run dev` (in /server)
- Frontend: `npm run dev` (in /client)

Frontend runs on http://localhost:5173
Backend runs on http://localhost:4000

## Default Admin Login (from .env.example)
- Email: admin@example.com
- Password: admin12345

## Notes
- CORS is configured for dev: http://localhost:5173 with credentials.
- Sessions stored in Postgres via connect-pg-simple.
- Update the `DATABASE_URL` in `.env` for your environment.
