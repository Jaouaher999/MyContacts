## MyContacts

Full‑stack contacts manager with a Node.js/Express + MongoDB backend and a React frontend.

### Project Structure

```
MyContacts/
  mycontacts-backend/    # Express API (JWT auth, Swagger, Jest tests)
  mycontacts-frontend/   # React app
```

### Requirements

- Node.js 18+
- MongoDB (local or cloud)

---

## Backend (mycontacts-backend)

### Environment variables

Create `mycontacts-backend/.env` with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mycontacts
JWT_SECRET=replace-with-a-strong-secret
FRONTEND=http://localhost:3000
# Optional: set the public base URL when deployed (used in Swagger UI "Servers")
RENDER_EXTERNAL_URL=https://your-api.onrender.com
```

### Install & run

```bash
cd mycontacts-backend
npm install

# Development (with reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000` and serves API under `http://localhost:5000/api`.

### API Docs (Swagger)

- UI: `http://localhost:5000/api/docs`
- When deployed, Swagger uses `RENDER_EXTERNAL_URL` (if set) as the server URL.

### Response envelope

All controllers return a consistent envelope:

```json
{
  "message": "string",
  "data": {}
}
```

Errors also use the same shape with a descriptive `message` and `data: null`.

Error handler returns:

```json
{
  "message": "error description",
  "stack": "stack trace (omitted in production)"
}
```

### Authentication

- Bearer JWT via `Authorization: Bearer <token>`

### Endpoints

- Auth

  - POST `/api/auth/register`
    - body: `{ email: string, password: string }`
    - 201 Created → `{ _id, email, token }`
  - POST `/api/auth/login`
    - body: `{ email: string, password: string }`
    - 200 OK → `{ _id, email, token }`
  - GET `/api/auth/profile` (auth)
    - 200 OK → `{ _id, email }`

- Contacts (all require auth)

  - POST `/api/contacts`
    - body: `{ firstName?: string, lastName?: string, phone: string }`
    - 201 Created → `{ _id, firstName, lastName, phone }`
  - GET `/api/contacts`
    - 200 OK → `[{ _id, firstName, lastName, phone }, ...]`
  - GET `/api/contacts/{id}`
    - 200 OK → `{ _id, firstName, lastName, phone }`
  - PATCH `/api/contacts/{id}`
    - body: `{ firstName?, lastName?, phone? }`
    - 200 OK → updated contact
  - DELETE `/api/contacts/{id}`
    - 204 No Content

- System
  - GET `/api/health`
    - 200 OK → `{ message, data: { status, uptime, timestamp } }`

### Validation & Errors

- Uses `express-validator`; common error statuses: 400 (validation), 401 (unauthorized), 404 (not found), 409 (conflict).
- Global error handler sets `message` and includes `stack` only when `NODE_ENV !== 'production'`.

### Testing (Jest)

```bash
cd mycontacts-backend
npm test
```

Included suites:

- `authService` (register/login happy paths and error cases)
- `contactService` (create/list/get/update/delete, with error cases)

Coverage can be enabled by running:

```bash
npx jest --coverage
```

---

## Frontend (mycontacts-frontend)

### Install & run

```bash
cd mycontacts-frontend
npm install
npm start
```

Runs at `http://localhost:3000`.

### Scripts

```bash
# Start dev server
npm start

# Run tests (React Testing Library)
npm test

# Build for production
npm run build
```

### Environment

If you need to configure the backend base URL for the frontend, create `mycontacts-frontend/.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Routing & protection

- Uses `react-router-dom`; private pages are wrapped with `ProtectedRoute` which checks for `token` in `localStorage` and redirects to `/login` if missing.

### Deployment

- Netlify (frontend): SPA redirect configured via `mycontacts-frontend/netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- Render/Any host (backend): set `RENDER_EXTERNAL_URL` to your public API URL so Swagger "Servers" shows the correct base.
- CORS: set `FRONTEND` in backend `.env` (e.g., `https://your-frontend.netlify.app`) so the API allows requests from your deployed frontend.

---

## Development Tips

- Start backend first so the frontend can call the API.
- Use Swagger at `http://localhost:5000/api/docs` to explore and test endpoints.
- Ensure MongoDB is running and `MONGO_URI` is reachable.

---

## Troubleshooting

- 401 Unauthorized: ensure you include `Authorization: Bearer <token>` after logging in.
- 409 Conflict on contact creation: the phone number already exists.
- Cannot connect to DB: verify `MONGO_URI` and that MongoDB is running.
