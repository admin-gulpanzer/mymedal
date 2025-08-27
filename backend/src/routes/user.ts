import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router: Router = Router();

// Get current user profile
router.get('/profile', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    
    res.json({
      id: user.id,
      email: user.primaryEmail,
      displayName: user.displayName,
      profileImageUrl: user.profileImageUrl,
      hasVerifiedEmail: user.hasVerifiedEmail,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.patch('/profile', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const { displayName } = req.body;
    
    if (displayName) {
      await user.update({ displayName });
    }
    
    res.json({
      id: user.id,
      email: user.primaryEmail,
      displayName: user.displayName,
      profileImageUrl: user.profileImageUrl,
      hasVerifiedEmail: user.hasVerifiedEmail,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;
