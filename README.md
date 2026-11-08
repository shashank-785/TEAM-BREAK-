# LearnOS — AI-Powered Autonomous Student Learning & Career Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests Status](https://img.shields.io/badge/tests-10%2F10%20passing-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/platform-React%2018%20%7C%20Vite%20%7C%20Node.js%20%7C%20Express-indigo.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

LearnOS is an autonomous, full-stack student learning and career acceleration platform designed for university computer science engineering students. Built with a modern dark interface, offline-first fallback capabilities, zero-cost architecture, and pedagogical AI co-pilots.

---

## 🎨 Design System

Engineered with high contrast, modern dark ergonomics:

| Element | Color Hex | Visual Description |
| :--- | :--- | :--- |
| **Background** | `#0B0D12` | Deep space obsidian black |
| **Cards** | `#151923` | Charcoal slate surface |
| **Card Hover** | `#1C2230` | Subtle elevation border |
| **Borders** | `#232936` | Sleek border lines |
| **Accent** | `#6366F1` | Electric Indigo (Brand Primary) |
| **Main Text** | `#F8FAFC` | Crisp white typography |
| **Secondary Text** | `#94A3B8` | Muted slate gray |
| **Font** | `Inter` / `JetBrains Mono` | Responsive variable font |

---

## 🏛️ Autonomous Agent Roles

The application was engineered with 6 isolated agent responsibilities:

| Agent | Isolated Responsibility | Modules Implemented |
| :--- | :--- | :--- |
| **ATLAS** | Frontend Architecture & Layout | Dashboard (1), AI Assistant (8), Analytics (9), Profile/Settings (10), Layout & Shared UI |
| **NOVA** | Academic Core & Documents | College Tutor (2), Notes & Documents (4), Exam Centre (5) |
| **ORBIT** | Productivity & Study Cycles | Study Planner (3), Timetable Grid, Spaced Repetition, Pomodoro Timer |
| **FORGE** | Coding & Career Development | Coding Lab (6), Sandbox Execution, Skill Trees (7), AI Mock Interview |
| **KERNEL** | Backend, Database & AI Core | Express Server, Supabase & SQLite DB, Academic AI Engine, Execution Sandbox |
| **SENTINEL** | Security, Testing & Health | Test Harness (`api.test.ts`), Health Probes, Package Validator |

---

## 📦 Project Modules

1. **Dashboard (ATLAS)**: Real-time GPA tracker, study hours, problem statistics, today's schedule, AI focus recommendations, and subject mastery meters.
2. **College Tutor (NOVA)**: 6 university core subjects (DSA, OS, DBMS, Networks, Math, AI), Unit 1-5 syllabus trees, and interactive Socratic AI tutor (Feynman explanations, code samples, analogies).
3. **Study Planner (ORBIT)**: Weekly class timetable, Kanban task sprint board, SuperMemo SM-2 spaced repetition queue, and Pomodoro focus timer with Web Audio ambient noise synthesizer.
4. **Notes & Documents (NOVA)**: Markdown note manager, document ingestion, one-click AI study summarizer, and automated exam question generator.
5. **Exam Centre (NOVA)**: Adaptive quizzes with timer, 3D flip card flashcards, timed mock exam mode, and 2021-2025 university PYQ bank with model solutions.
6. **Coding Lab (FORGE)**: Multi-language IDE (C, Python, JavaScript), curated problem library (Two Sum, Valid Parentheses, Reverse List), Piston/VM sandbox runner, and AI code assistant.
7. **Skill Development (FORGE)**: Visual career roadmaps (Full-Stack AI, ML Specialist), prerequisite skill trees, and interactive AI Technical Mock Interview Simulator with rubric scoring.
8. **AI Assistant (ATLAS/KERNEL)**: Centralized academic and career chatbot with pre-built prompt templates (Resume review, Bug trace, 7-day study plan, Math solver).
9. **Analytics (ATLAS/SENTINEL)**: Weekly study distribution charts, problem difficulty breakdown, 30-day activity streak calendar, and 6+ unlockable gamification badges.
10. **Profile, Settings & Help (ATLAS/KERNEL)**: Student profile customizer, Gemini/Supabase config, live system diagnostics audit, and comprehensive documentation manual.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher, tested on v24)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository and enter the directory
cd learnos

# Install dependencies for both client and server
npm install --prefix client
npm install --prefix server
```

### Running Locally
You can run both client and server simultaneously:

```bash
# Start Backend API (Port 5000)
npm run dev:server

# In a second terminal, start Vite Client (Port 5173)
npm run dev:client
```
- Open browser at: **`http://localhost:5173`**
- Backend Health Check: **`http://localhost:5000/api/system/health`**

### Building for Production
```bash
# Type check and build both client & server
npm run build
```

### Running Test Suite
```bash
# Execute KERNEL & SENTINEL automated test harness
npm test
```

---

## 🔒 Security & Privacy
- Zero client-side API key leakage. All LLM and Supabase calls are proxied securely through the Node.js backend.
- Standalone execution: Operates 100% self-contained using its built-in Academic Reasoning Engine and local sandbox runner even when offline or without external API keys.
