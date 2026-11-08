import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialSubjects,
  initialTasks,
  initialSchedules,
  initialRevisionItems,
  initialNotes,
  initialQuizzes,
  initialFlashcards,
  initialMockExams,
  initialPYQs,
  initialCodingProblems,
  initialRoadmaps,
  initialAchievements
} from '../src/db/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const output = path.resolve(__dirname, '../data/learnos.json');
const now = new Date().toISOString();

const demoData = {
  user: {
    id: 'usr_demo_shashank',
    name: 'Shashank Soam',
    email: 'shashank.demo@learnos.app',
    university: 'Indian Institute of Information Technology, Sonepat',
    major: 'B.Tech Computer Science and Engineering',
    semester: 1,
    targetGpa: 10,
    currentGpa: 0,
    streakDays: 6,
    totalStudyHours: 16.5,
    quizzesCompleted: 18,
    problemsSolved: 54,
    dreamRole: 'Full-Stack Developer Intern',
    avatarUrl: '',
    createdAt: now
  },
  subjects: initialSubjects,
  tasks: initialTasks,
  schedules: initialSchedules,
  revisions: initialRevisionItems,
  notes: initialNotes,
  quizzes: initialQuizzes,
  flashcards: initialFlashcards,
  mockExams: initialMockExams,
  pyqs: initialPYQs,
  codingProblems: initialCodingProblems,
  roadmaps: initialRoadmaps,
  interviews: [],
  achievements: initialAchievements,
  aiHistory: [
    {
      id: 'demo_ai_1',
      role: 'assistant',
      text: 'Welcome, Shashank! I am your LearnOS study assistant. Ask me about C programming, JavaScript, FEE, mathematics, or your career plan.',
      timestamp: now
    }
  ]
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(demoData, null, 2), 'utf8');
console.log(`Demo data seeded to ${output}`);
