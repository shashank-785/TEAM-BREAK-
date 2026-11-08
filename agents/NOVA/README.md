# NOVA Agent — College Tutor, Notes & Exam Centre

## Responsibility
**NOVA** is responsible for the academic learning core: College Tutor curriculum and AI explanations, Notes & Documents ingestion/summarization, and Exam Centre (Adaptive Quizzes, Flashcard recall, Mock Exams, and University PYQ bank).

## Completed Features
- **College Tutor (Module 2)**:
  * 6 Core University subjects: Data Structures, Operating Systems, DBMS, Computer Networks, Discrete Math, AI & ML.
  * Unit 1-5 syllabus tree with topic reader, formulas, and code snippets.
  * Embedded AI Co-Pilot: "Feynman", "Analogy", "Code Example", "Socratic Quiz", and custom question answering.
  * One-click topic completion tracker.
- **Notes & Documents (Module 4)**:
  * Markdown notes manager with folder and tag categorization.
  * Document upload simulator (ingest `.txt`, `.md`, `.pdf`).
  * One-click AI Summarizer (executive TL;DR & key takeaways).
  * AI Exam Question Generator (3 step-by-step questions from note text).
  * Markdown export and JSON download.
- **Exam Centre (Module 5)**:
  * Adaptive quizzes with timer, option selection, instant feedback, and score celebration.
  * 3D card flip interactive flashcards with "Mastered" vs "Needs Review" grading.
  * University PYQ Bank (2021-2025) with marks breakdown and verified model answers.

## Source Code Mapping
- `client/src/pages/CollegeTutor/CollegeTutor.tsx`
- `client/src/pages/Notes/Notes.tsx`
- `client/src/pages/ExamCentre/ExamCentre.tsx`
- `server/src/routes/tutor.ts`
- `server/src/routes/notes.ts`
- `server/src/routes/exams.ts`

## Build & Test Results
- Client build: Included in Vite production bundle without errors.
- Backend API tests: `Subjects & Curriculum Tree`, `Notes CRUD & Search`, and `Quizzes & Flashcards Retrieval` passed (100% green).

## Setup Instructions
```bash
# Run server
npm run dev:server
# Run client
npm run dev:client
```
Navigate to `/tutor`, `/notes`, or `/exams`.
