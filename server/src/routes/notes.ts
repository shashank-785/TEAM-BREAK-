import { Router, Request, Response } from 'express';
import { db } from '../db/db.js';
import { aiService } from '../services/aiService.js';

const router = Router();

// Get all notes
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, notes: db.getNotes() });
});

// Create a new note
router.post('/', (req: Request, res: Response) => {
  const { title, subject, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, error: 'Title and Content are required' });
  }
  const note = db.createNote({
    title,
    subject: subject || 'General',
    content,
    tags: Array.isArray(tags) ? tags : []
  });
  res.status(201).json({ success: true, note });
});

// Update a note
router.put('/:id', (req: Request, res: Response) => {
  const note = db.updateNote(req.params.id, req.body);
  if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
  res.json({ success: true, note });
});

// Delete a note
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteNote(req.params.id);
  res.json({ success: deleted });
});

// AI Summarization for a note
router.post('/:id/summarize', async (req: Request, res: Response) => {
  const note = db.getNotes().find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, error: 'Note not found' });

  try {
    const prompt = `Please summarize the following student study note on "${note.title}". Provide:
1. A concise executive TL;DR (3-4 sentences).
2. Key mathematical/architectural concepts and invariants.
3. 3-5 bulleted exam focus points.

Note Content:
${note.content}`;

    const summary = await aiService.generateResponse(prompt, 'notes');
    const updatedNote = db.updateNote(note.id, { summary });
    res.json({ success: true, summary, note: updatedNote });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Question Generator from a note
router.post('/:id/generate-questions', async (req: Request, res: Response) => {
  const note = db.getNotes().find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, error: 'Note not found' });

  try {
    const prompt = `Based on these study notes on "${note.title}", generate 3 exam-style technical questions with detailed step-by-step model solutions.

Note Content:
${note.content}`;

    const questionsResponse = await aiService.generateResponse(prompt, 'exam_questions');
    res.json({ success: true, questions: questionsResponse });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
