# FORGE Agent — Coding Lab & Skill Development

## Responsibility
**FORGE** is responsible for the technical development suite: Coding Lab IDE, Sandboxed execution, problem runner, career skill roadmaps, and AI Technical Mock Interview Simulator.

## Completed Features
- **Coding Lab (Module 6)**:
  * Multi-language IDE interface (C, Python, JavaScript).
  * Problem Library (Two Sum, Valid Parentheses, Reverse Linked List) with constraints and sample I/O.
  * Live code execution console (stdout, stderr, execution time, memory estimation).
  * Automated hidden test case evaluation runner with pass/fail breakdown.
  * AI Code Assistant: "Explain Code", "Find Bugs", "Optimize Complexity", "Generate Edge Cases".
- **Skill Development & Career (Module 7)**:
  * Visual career roadmaps (Full-Stack AI Engineer, Machine Learning Specialist).
  * Prerequisite-based interactive skill tree with node statuses (Locked, Available, In Progress, Mastered).
  * AI Technical Mock Interview Simulator:
    - Role selection (Frontend, Backend, AI, Full-Stack).
    - Realistic technical scenario prompts.
    - Rubric-based scoring (0-100) on Technical Accuracy, Communication, and Trade-Off Analysis.
    - Actionable strengths, improvements, and adaptive follow-up questions.

## Source Code Mapping
- `client/src/pages/CodingLab/CodingLab.tsx`
- `client/src/pages/SkillDevelopment/SkillDevelopment.tsx`
- `server/src/routes/coding.ts`
- `server/src/routes/skills.ts`
- `server/src/services/codeExecutionService.ts`

## Build & Test Results
- Client build: Included in Vite bundle cleanly.
- Backend API tests: `JavaScript Sandbox Execution (Two Sum Logic)`, `Problem Test Cases Evaluation Runner`, and `Skill Roadmaps & Interview Evaluator` all passed (100% green).

## Setup Instructions
```bash
npm run dev
```
Navigate to `/coding` or `/skills`.
