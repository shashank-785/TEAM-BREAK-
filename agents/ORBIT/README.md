# ORBIT Agent — Study Planner & Productivity

## Responsibility
**ORBIT** is responsible for student productivity, timetable management, spaced repetition revision tracking, and deep focus time logging.

## Completed Features
- **Task Management Board (Kanban & List)**:
  * To Do, In Progress, and Completed columns.
  * Task creation modal with priority, subject, and deadline selectors.
  * Drag/click status transitions.
- **Class & Study Timetable**:
  * 5-day visual weekly schedule grid with lectures, labs, and study pods.
  * Color-coded category tags.
- **Spaced Repetition Revision Manager**:
  * SuperMemo / SM-2 spaced repetition queue (Day 1 → 3 → 7 → 14 → 30).
  * "Due Today" indicator and "Advance Stage" progression button.
- **Pomodoro Focus Timer & Ambient Synthesizer**:
  * 25m Focus, 5m Short Break, 15m Long Break intervals.
  * Start, Pause, and Reset controls with countdown display.
  * Built-in Web Audio API ambient sound synthesizer (White Noise, Soft Rain, Binaural 432Hz) with zero external audio assets.
  * Auto-logs finished focus sessions (+0.42 hrs) to student analytics and database.

## Source Code Mapping
- `client/src/pages/StudyPlanner/StudyPlanner.tsx`
- `server/src/routes/planner.ts`
- `server/src/types/index.ts`

## Build & Test Results
- Client build: Included in Vite bundle cleanly.
- Backend API tests: `Task Creation, Update and Deletion` passed (100% green).

## Setup Instructions
```bash
npm run dev
```
Navigate to `/planner` in your browser.
