# Node.js Student Records API (Express + SQLite)

## Overview
Secure REST API with layered architecture (Controllers → Services → Models), API key protection, and SQLite persistence.

**Note:** This project uses `sql.js` instead of `better-sqlite3` because the Node.js version used did not support `better-sqlite3`.

## Requirements
- Node.js 18+
- npm

## Setup
```bash
npm init -y
npm install express sql.js dotenv
npm install -D nodemon
```

Create .env from .env.example and set:
```
API_KEY=your-strong-random-value
PORT=3000
NODE_ENV=development
DATABASE_URL=./database.sqlite
```

## Run
```bash
npm run dev   # development (nodemon)
# or
npm start     # production style
```

## Endpoints
### Public
- `GET /` — welcome + endpoints
- `GET /health` — health check

### Protected (provide API key)
Headers:
- `X-API-Key: <key>` or
- `Authorization: Bearer <key>`

- `GET /users` — list users
- `GET /users/:id` — get user by id
- `POST /users` — create `{ "name": "Alice", "email": "a@ex.com" }`
- `PUT /users/:id` — update `{ "name": "...", "email": "..." }`
- `DELETE /users/:id` — delete

## curl Examples
```bash
# List users
curl -H "X-API-Key: $API_KEY" http://localhost:3000/users

# Create user
curl -X POST -H "Content-Type: application/json" \
     -H "X-API-Key: $API_KEY" \
     -d '{"name":"Eve","email":"eve@example.com"}' \
     http://localhost:3000/users
```

## Notes
- In development, database seeds 4 users if empty.
- `.env` and SQLite files are ignored by Git.
- Ready for Render deployment: set env vars in dashboard and mount a persistent volume for the DB file.

---

# How to run (quick commands)

1. Initialize project and install:
   ```bash
   npm init -y
   npm install express sql.js dotenv
   npm install -D nodemon
   ```

2. Add all files above.

3. Create `.env` from `.env.example` and set a strong `API_KEY`.

4. Run:
   ```bash
   npm run dev
   ```

5. Test:
   ```bash
   curl -H "X-API-Key: yourkey" http://localhost:3000/users
   ```
