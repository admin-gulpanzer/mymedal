import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

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
    
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Get user data from database
    const userResult = await pool.query(
      'SELECT id, email, display_name FROM auth_users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      displayName: user.display_name
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
      const token = authHeader.substring(7);
      
      try {
        // Verify JWT token
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Get user data from database
        const userResult = await pool.query(
          'SELECT id, email, display_name FROM auth_users WHERE id = $1',
          [decoded.userId]
        );

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          req.user = {
            id: user.id,
            email: user.email,
            displayName: user.display_name
          };
        }
      } catch (tokenError) {
        // Invalid token, continue without user
        console.log('Invalid token in optional auth:', (tokenError as Error).message);
      }
    }
    next();
  } catch (error) {
    // Continue without user if auth fails
    next();
  }
};
