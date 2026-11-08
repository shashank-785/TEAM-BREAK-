import { createHmac, timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export interface AuthRequest extends Request {
  auth?: { email: string; userId: string };
}

const defaultSecret = 'learnos-local-development-secret-change-me';
const getSecret = () => process.env.AUTH_SECRET || defaultSecret;

export function createSessionToken(userId: string, email: string): string {
  const payload = Buffer.from(JSON.stringify({
    userId,
    email,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  })).toString('base64url');
  const signature = createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const [payload, signature] = authorization.slice(7).split('.');
  if (!payload || !signature) {
    return res.status(401).json({ success: false, error: 'Invalid authentication token' });
  }

  const expected = createHmac('sha256', getSecret()).update(payload).digest('base64url');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return res.status(401).json({ success: false, error: 'Invalid authentication token' });
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      userId: string;
      email: string;
      expiresAt: number;
    };
    if (!session.userId || !session.email || session.expiresAt < Date.now()) {
      return res.status(401).json({ success: false, error: 'Session expired' });
    }
    req.auth = { userId: session.userId, email: session.email };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid authentication token' });
  }
}
