import { Router, Request, Response } from 'express';
import { db } from '../db/db.js';

const router = Router();

// Quizzes
router.get('/quizzes', (req: Request, res: Response) => {
  const subject = req.query.subject as string | undefined;
  res.json({ success: true, quizzes: db.getQuizzes(subject) });
});

// Flashcards
router.get('/flashcards', (req: Request, res: Response) => {
  const subject = req.query.subject as string | undefined;
  res.json({ success: true, flashcards: db.getFlashcards(subject) });
});

router.post('/flashcards/:id/toggle-mastery', (req: Request, res: Response) => {
  const card = db.toggleFlashcardMastery(req.params.id);
  if (!card) return res.status(404).json({ success: false, error: 'Flashcard not found' });
  res.json({ success: true, flashcard: card });
});

// Mock Exams
router.get('/mock-exams', (req: Request, res: Response) => {
  res.json({ success: true, mockExams: db.getMockExams() });
});

// Submit Quiz / Exam Score
router.post('/submit', (req: Request, res: Response) => {
  const { answers, totalQuestions } = req.body; // e.g. { 'q_1': 1, 'q_2': 2 }
  const quizzes = db.getQuizzes();
  let correctCount = 0;
  const breakdown: any[] = [];

  for (const q of quizzes) {
    if (answers && answers[q.id] !== undefined) {
      const isCorrect = answers[q.id] === q.correctOption;
      if (isCorrect) correctCount++;
      breakdown.push({
        questionId: q.id,
        userAnswer: answers[q.id],
        correctOption: q.correctOption,
        isCorrect,
        explanation: q.explanation
      });
    }
  }

  // Update user stats
  const user = db.getUser();
  db.updateUser({ quizzesCompleted: user.quizzesCompleted + 1 });

  const scorePercentage = breakdown.length > 0 ? Math.round((correctCount / breakdown.length) * 100) : 0;

  res.json({
    success: true,
    score: correctCount,
    total: breakdown.length || totalQuestions || 5,
    scorePercentage,
    breakdown
  });
});

// Previous Year Questions (PYQ Bank)
router.get('/pyqs', (req: Request, res: Response) => {
  const subject = req.query.subject as string | undefined;
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  res.json({ success: true, pyqs: db.getPYQs(subject, year) });
});

export default router;
