# Customer Frontend (Black & White)

Minimal React frontend for session-authenticated login/logout and customer CRUD.

## Features
- Login/Logout (session-based auth)
- List customers
- Add/Edit/Delete customer
- Minimalistic black-and-white theme

## API Configuration
Backend base URL is configured via environment variable:
- `REACT_APP_API_BASE` (optional): e.g. `http://localhost:8000`
  - If omitted, calls are made to relative paths such as `/api/...` suitable for same-origin deployments or dev proxy setups.

Create a `.env` file (do not commit) based on `.env.example`.

## Development
- `npm start` – start dev server
- `npm test` – run tests (CI-friendly)
- `npm run build` – production build

## Notes
- This app uses `fetch` with `credentials: 'include'` to send cookies required by Django session authentication.
- Backend endpoints used:
  - `POST /api/auth/login/`
  - `POST /api/auth/logout/`
  - `GET /api/customers/`
  - `GET /api/customers/{id}/`
  - `POST /api/customers/`
  - `PUT /api/customers/{id}/`
  - `DELETE /api/customers/{id}/`
- Ensure CORS/session config on the backend allows the frontend origin and credentials.
