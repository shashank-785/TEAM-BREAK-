import { NextFunction, Request, Response } from 'express';

const writeAttempts = new Map<string, { count: number; resetAt: number }>();

export function validateJsonPayload(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') return next();
  if (req.body !== undefined && req.body !== null && typeof req.body !== 'object') {
    return res.status(400).json({ success: false, error: 'JSON request body must be an object' });
  }
  next();
}

export function rateLimitWrites(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

  const key = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const limit = 120;
  const current = writeAttempts.get(key);

  if (!current || now >= current.resetAt) {
    writeAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }
  if (current.count >= limit) {
    res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
    return res.status(429).json({ success: false, error: 'Too many requests' });
  }
  current.count += 1;
  next();
}
