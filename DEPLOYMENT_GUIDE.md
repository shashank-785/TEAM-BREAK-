# LearnOS Deployment Guide

## Local development

From the LearnOS root:

```bash
npm install --prefix client
npm install --prefix server
npm run dev:server
```

In a second terminal:

```bash
npm run dev:client
```

Open `http://localhost:5173`.

## Environment

Copy `.env.example` to `.env` in the LearnOS root or server folder. Never commit real secrets.

Available settings:

- `PORT`: Express API port
- `CORS_ORIGINS`: comma-separated allowed frontend origins
- `GEMINI_API_KEY`: optional server-side Gemini key
- `PISTON_API_URL`: isolated code execution endpoint
- `AUTH_SECRET`: signing secret for authenticated API sessions
- `DEMO_USER_EMAIL`: demo account email
- `DEMO_USER_PASSWORD`: demo account password

Without a Gemini key, LearnOS uses its documented local academic fallback. Without Piston, code execution returns an unavailable state rather than executing code on the application server.

## Production build

```bash
npm run build:client
npm run build:server
```

Deploy the Express API separately and serve the contents of `client/dist` through the frontend host. Configure the frontend host origin in `CORS_ORIGINS`.
