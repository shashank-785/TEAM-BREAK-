import { Router, Request, Response } from 'express';
import { db } from '../db/db.js';

const router = Router();

router.get('/overview', (req: Request, res: Response) => {
  const user = db.getUser();
  const achievements = db.getAchievements();

  // Weekly study hours breakdown
  const weeklyStudyHours = [
    { day: 'Mon', hours: 4.5, subject: 'Operating Systems' },
    { day: 'Tue', hours: 5.2, subject: 'DSA' },
    { day: 'Wed', hours: 3.8, subject: 'DBMS' },
    { day: 'Thu', hours: 6.0, subject: 'Coding Lab' },
    { day: 'Fri', hours: 4.0, subject: 'Networks' },
    { day: 'Sat', hours: 7.5, subject: 'Full Stack Roadmap' },
    { day: 'Sun', hours: 5.5, subject: 'Mock Exams' }
  ];

  // Subject Mastery percentages
  const subjectMasteries = [
    { subject: 'Data Structures & Algorithms', mastery: 86, color: '#6366F1' },
    { subject: 'Operating Systems', mastery: 78, color: '#10B981' },
    { subject: 'Database Management Systems', mastery: 82, color: '#F59E0B' },
    { subject: 'Computer Networks', mastery: 72, color: '#06B6D4' },
    { subject: 'Discrete Mathematics', mastery: 90, color: '#8B5CF6' },
    { subject: 'AI & Machine Learning', mastery: 68, color: '#EC4899' }
  ];

  // Coding distribution
  const codingStats = {
    totalSolved: user.problemsSolved,
    easy: 28,
    medium: 21,
    hard: 5,
    acceptanceRate: 74.2
  };

  // 30-Day Activity Heatmap simulation
  const activityHeatmap = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = i % 7 === 0 ? 0 : Math.floor(Math.random() * 5 + 1);
    activityHeatmap.push({ date: dateStr, count });
  }

  res.json({
    success: true,
    user,
    weeklyStudyHours,
    subjectMasteries,
    codingStats,
    activityHeatmap,
    achievements
  });
});

export default router;
