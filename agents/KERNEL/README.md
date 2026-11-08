# KERNEL Agent — Backend, Database, Auth & Execution APIs

## Responsibility
**KERNEL** is responsible for the server infrastructure, database persistence, PostgreSQL / Supabase schema migrations, sandboxed code execution engine, and the autonomous academic AI proxy service.

## Completed Features
- **Server Framework**: Node.js + Express + TypeScript with ESM modules.
- **Database & Storage**:
  * Persistent transactional JSON/file storage with automatic seeding to `server/data/learnos.json`.
  * Complete PostgreSQL / Supabase DDL schema in `server/src/db/schema.sql`.
  * Supabase adapter in `server/src/db/supabaseClient.ts`.
- **Autonomous AI Engine**:
  * Dual-mode design: Proxies to Google Gemini API (free tier) when `GEMINI_API_KEY` is present.
  * Built-in high-precision Computer Science Academic Reasoning Engine fallback for offline/zero-cost operation.
- **Sandboxed Code Execution Engine**:
  * Piston API integration (`https://emkc.org/api/v2/piston/execute`) for C, Python, and JavaScript.
  * In-process isolated Node VM sandbox fallback for JavaScript.
  * Simulated test evaluator for Python and C.
- **REST Endpoints for 10 Modules**:
  * `/api/auth`
  * `/api/tutor`
  * `/api/planner`
  * `/api/notes`
  * `/api/exams`
  * `/api/coding`
  * `/api/skills`
  * `/api/ai`
  * `/api/analytics`
  * `/api/system`

## Source Code Mapping
- `server/src/index.ts`
- `server/src/types/index.ts`
- `server/src/db/db.ts`
- `server/src/db/seed.ts`
- `server/src/db/schema.sql`
- `server/src/db/supabaseClient.ts`
- `server/src/services/aiService.ts`
- `server/src/services/codeExecutionService.ts`
- `server/src/routes/*.ts`

## Build & Test Results
- TypeScript Build (`tsc`): Passed with 0 errors.
- Test Suite: 10/10 tests passing.

## Setup Instructions
```bash
cd server
npm install
npm run dev
```
Server starts on `http://localhost:5000`. Health check: `http://localhost:5000/api/system/health`.
