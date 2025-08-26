import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.substring(7);
    
    // For now, just create a mock user object for development
    // TODO: Implement proper Stack Auth verification
    req.user = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      displayName: 'Demo User'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      // For now, just create a mock user object for development
      req.user = {
        id: 'demo-user-123',
        email: 'demo@example.com',
        displayName: 'Demo User'
      };
    }
    next();
  } catch (error) {
    // Continue without user if auth fails
    next();
  }
};
