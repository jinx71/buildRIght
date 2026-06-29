# BuildRight — Construction Corporate Site

**App #4** of the 12-app MERN portfolio. A polished corporate website for a Dublin construction firm, with a filterable project portfolio, a quote-request pipeline (saved to Mongo and emailed), an interactive cost estimator, and a live **building-permit feed proxied + cached** through the backend. An admin dashboard manages incoming leads behind JWT auth.

> **Engineering lesson:** corporate-grade UX polish + a real external-API integration done the right way — key proxying, defensive normalization, and server-side caching so the frontend never hammers the upstream and never sees a credential.

---

## ✨ Features

- **Marketing site** — home, about, services, projects, permits, estimator, contact
- **Filterable project gallery** with category tabs, served from MongoDB
- **Cost estimator** — interactive sliders give an indicative €/m² range for early planning
- **Permits feed** — recent building permits from the Socrata SODA API, proxied through Express and cached for 10 minutes (with a sample-data fallback so the page never blanks)
- **Quote requests** — public contact form (react-hook-form, validated client + server) that saves to Mongo and emails the firm via nodemailer
- **Admin dashboard** — JWT-protected; review, status-track and delete quote requests
- **Shared design system** — `Button`, `Card`, `Input`, `Badge`, `Spinner`, `EmptyState`, `SectionHeading`, `Logo`, `Navbar`, `Footer` — reused across the portfolio
- **Accessibility** — semantic HTML, labelled forms, visible keyboard focus, `prefers-reduced-motion` respected
- **Mobile-first responsive** layout, every async view ships loading + empty + error states

---

## 🧱 Tech stack (2021–2022 pinned)

**Frontend** — React 17.0.2, react-router-dom 6.3.x, axios 0.27.2, Tailwind CSS 3.1.x, react-hook-form 7.x, react-toastify 9.x, CRA 5

**Backend** — Node 16 LTS, Express 4.18.1, Mongoose 6.5.x, jsonwebtoken 8.5.1, bcryptjs 2.4.3, express-validator 6.14.x, helmet 6.x, express-rate-limit 6.x, node-cache 5.x, nodemailer 6.7.x, morgan 1.10.x

**Database** — MongoDB 5/6 (local or Atlas)

**External API** — Socrata SODA (Chicago building permits) — keyless, proxied + cached server-side

---

## 🚀 Setup

### 1. Prerequisites
- **Node.js 16.x** (enforced via `engines`)
- **MongoDB** running locally on `mongodb://localhost:27017` (or an Atlas connection string)

### 2. Install
From the `buildright/` root:

```bash
npm run install:all
```

…or manually:

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment

Copy both example files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` and set at minimum:
- `MONGO_URI` — your Mongo connection string
- `JWT_SECRET` — any long random string

The defaults work out of the box. Email is **logged to the console** if SMTP is not configured.

### 4. Seed the database

```bash
cd server
npm run seed
```

This creates:
- An admin user: `admin@buildright.dev` / `admin12345`
- A starter portfolio of 8 projects

### 5. Run client + server together

From `server/`:

```bash
npm run dev
```

This boots:
- API → http://localhost:5000
- Web → http://localhost:3000

---

## 🔑 Environment variables

### `server/.env`
| Key | Purpose |
|---|---|
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | Mongo connection string |
| `JWT_SECRET` | Token signing secret |
| `JWT_EXPIRES_IN` | Token TTL (default `7d`) |
| `CLIENT_URL` | Allowed CORS origin (default `http://localhost:3000`) |
| `PERMITS_BASE_URL` | Socrata dataset URL (default: City of Chicago building permits) |
| `SOCRATA_APP_TOKEN` | Optional — raises the upstream rate limit |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP for nodemailer (blank → console log mode) |
| `MAIL_FROM` / `MAIL_TO` | Email sender / recipient |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed-script admin credentials |

### `client/.env`
| Key | Purpose |
|---|---|
| `REACT_APP_API_URL` | Backend base URL (default `http://localhost:5000/api`) |

---

## 🗺️ API surface

All responses use the portfolio-wide envelope:

```js
// success
{ "success": true, "data": { ... }, "message": "Optional" }
// failure
{ "success": false, "message": "What went wrong", "errors": [] }
```

| Method | Path | Auth | What |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create an admin user |
| `POST` | `/api/auth/login` | — | Sign in, receive JWT |
| `GET` | `/api/auth/me` | Bearer | Current user |
| `GET` | `/api/projects` | — | List (filter by `?category=…`) |
| `GET` | `/api/projects/:id` | — | Detail |
| `POST` | `/api/projects` | Admin | Create |
| `DELETE` | `/api/projects/:id` | Admin | Delete |
| `POST` | `/api/quotes` | — | Submit a quote request |
| `GET` | `/api/quotes` | Admin/Staff | List (filter by `?status=…`) |
| `PATCH` | `/api/quotes/:id/status` | Admin/Staff | Update status |
| `DELETE` | `/api/quotes/:id` | Admin | Delete |
| `GET` | `/api/permits` | — | Cached + normalized permit feed |
| `GET` | `/api/health` | — | Health check |

---

## 📁 Project structure

```
buildright/
├── client/                React (CRA 5, Tailwind 3)
│   ├── public/
│   └── src/
│       ├── api/           axios + endpoint helpers
│       ├── components/    shared design-system kit
│       ├── context/       AuthContext
│       ├── hooks/         useAuth
│       ├── pages/         Home, About, Services, Projects, Permits, Estimator, Contact, Login, AdminDashboard, NotFound
│       └── utils/         formatters
└── server/                Express + Mongoose
    └── src/
        ├── config/        db.js
        ├── controllers/   auth, quote, project, permit
        ├── middleware/    auth (protect + requireRole), errorHandler, notFound
        ├── models/        User, Quote, Project
        ├── routes/        thin routers (express-validator on inputs)
        ├── services/      permitService (proxy + node-cache), emailService
        └── utils/         apiResponse, asyncHandler, generateToken, seed
```

---

## 🧪 Definition-of-Done checklist

- [x] `npm install` in both folders, one command (`npm run dev` from `server/`) boots client + server
- [x] `.env.example` in client and server; real `.env` git-ignored
- [x] README with features, stack, setup, env vars, screenshot placeholders
- [x] Responsive mobile + desktop, accessibility basics in place
- [x] Loading / empty / error states on every async view
- [x] Shared design system + amber accent applied
- [x] Forms validated client (react-hook-form) and server (express-validator)
- [x] Keyed/rate-limited APIs proxied + cached through backend
- [x] JWT auth + protected admin routes; passwords never returned
- [x] Standard `{ success, data, message }` envelope across every endpoint
- [ ] Deployed (client → Netlify/Vercel, server → Render/Railway, DB → Atlas) — left for hosting time

---

## 📸 Screenshots

_Add screenshots into a `docs/screenshots/` folder:_
- `home.png` — hero with blueprint motif
- `projects.png` — filterable gallery
- `permits.png` — live cached permit feed
- `estimator.png` — cost estimator
- `contact.png` — quote form
- `admin.png` — admin dashboard

---

## 📜 License

MIT — feel free to fork for your own portfolio.
