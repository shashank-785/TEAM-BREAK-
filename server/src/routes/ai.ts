import { Router, Request, Response } from 'express';
import { db } from '../db/db.js';
import { aiService } from '../services/aiService.js';

const router = Router();

// Get recent AI chat history
router.get('/history', (req: Request, res: Response) => {
  res.json({ success: true, history: db.getAiHistory() });
});

// Send message to AI assistant
router.post('/chat', async (req: Request, res: Response) => {
  const { message, category } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  // Record user message
  const userMsg = {
    id: 'msg_' + Date.now().toString(36),
    role: 'user' as const,
    text: message,
    timestamp: new Date().toISOString()
  };
  db.addAiMessage(userMsg);

  try {
    const aiResponseText = await aiService.generateResponse(message, category || 'Centralized Academic Assistant');
    const aiMsg = {
      id: 'msg_ai_' + Date.now().toString(36),
      role: 'assistant' as const,
      text: aiResponseText,
      timestamp: new Date().toISOString()
    };
    db.addAiMessage(aiMsg);

    res.json({
      success: true,
      message: aiMsg,
      provider: aiService.getStatus().provider
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default router;
