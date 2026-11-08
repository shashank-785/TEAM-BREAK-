import { Router, Request, Response } from 'express';
import { db } from '../db/db.js';

const router = Router();

// Tasks
router.get('/tasks', (req: Request, res: Response) => {
  res.json({ success: true, tasks: db.getTasks() });
});

router.post('/tasks', (req: Request, res: Response) => {
  const { title, subjectName, dueDate, priority, status, category } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ success: false, error: 'Title and Due Date are required' });
  }
  const task = db.createTask({
    title,
    subjectName: subjectName || 'General',
    dueDate,
    priority: priority || 'medium',
    status: status || 'todo',
    category: category || 'assignment'
  });
  res.status(201).json({ success: true, task });
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  const task = db.updateTask(req.params.id, req.body);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
  res.json({ success: true, task });
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const deleted = db.deleteTask(req.params.id);
  res.json({ success: deleted });
});

// Timetable Schedules
router.get('/schedules', (req: Request, res: Response) => {
  res.json({ success: true, schedules: db.getSchedules() });
});

router.post('/schedules', (req: Request, res: Response) => {
  const sch = db.createSchedule(req.body);
  res.status(201).json({ success: true, schedule: sch });
});

router.delete('/schedules/:id', (req: Request, res: Response) => {
  const deleted = db.deleteSchedule(req.params.id);
  res.json({ success: deleted });
});

// Spaced Repetition Revisions
router.get('/revisions', (req: Request, res: Response) => {
  res.json({ success: true, revisions: db.getRevisions() });
});

router.post('/revisions/:id/advance', (req: Request, res: Response) => {
  const updated = db.advanceRevision(req.params.id);
  if (!updated) return res.status(404).json({ success: false, error: 'Revision item not found' });
  res.json({ success: true, revision: updated });
});

// Pomodoro session completion logger
router.post('/pomodoro/complete', (req: Request, res: Response) => {
  const user = db.getUser();
  const updatedHours = Number((user.totalStudyHours + 0.42).toFixed(1)); // ~25 min = 0.42 hrs
  db.updateUser({ totalStudyHours: updatedHours });
  res.json({ success: true, message: 'Pomodoro session recorded', totalStudyHours: updatedHours });
});

export default router;
