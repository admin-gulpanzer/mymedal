import { Router } from 'express';
import pool from '../config/database';
import { UserMedalWithDetails } from '../types';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user's medals
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    
    const result = await pool.query(`
      SELECT um.*,
             r.name as race_name,
             r.description as race_description,
             r.date as race_date,
             r.location as race_location,
             r.distance as race_distance,
             r.race_type,
             rs.participant_name,
             rs.bib_number,
             rs.finish_time,
             rs.overall_place,
             rs.age_group_place,
             rs.age_group
      FROM user_medals um
      JOIN races r ON um.race_id = r.id
      LEFT JOIN race_stats rs ON um.race_stat_id = rs.id
      WHERE um.user_id = $1
      ORDER BY um.claimed_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user medals:', error);
    res.status(500).json({ error: 'Failed to fetch medals' });
  }
});

// Claim a medal for a race
router.post('/claim', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { race_id, bib_number, notes } = req.body;
    
    if (!race_id || !bib_number) {
      return res.status(400).json({ error: 'Race ID and bib number are required' });
    }
    
    // Find the race stat for this bib number
    const statResult = await pool.query(`
      SELECT id FROM race_stats 
      WHERE race_id = $1 AND bib_number = $2
    `, [race_id, bib_number]);
    
    if (statResult.rows.length === 0) {
      return res.status(404).json({ error: 'No race stats found for this bib number' });
    }
    
    const race_stat_id = statResult.rows[0].id;
    
    // Check if medal is already claimed by this user
    const existingClaim = await pool.query(`
      SELECT id FROM user_medals 
      WHERE user_id = $1 AND race_id = $2
    `, [userId, race_id]);
    
    if (existingClaim.rows.length > 0) {
      return res.status(409).json({ error: 'Medal already claimed for this race' });
    }
    
    // Claim the medal
    const result = await pool.query(`
      INSERT INTO user_medals (user_id, race_id, race_stat_id, notes, is_verified)
      VALUES ($1, $2, $3, $4, false)
      RETURNING *
    `, [userId, race_id, race_stat_id, notes || null]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error claiming medal:', error);
    res.status(500).json({ error: 'Failed to claim medal' });
  }
});

// Update medal notes
router.patch('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { notes, medal_image_url } = req.body;
    
    const result = await pool.query(`
      UPDATE user_medals 
      SET notes = COALESCE($1, notes),
          medal_image_url = COALESCE($2, medal_image_url)
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `, [notes, medal_image_url, id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medal not found or not owned by user' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating medal:', error);
    res.status(500).json({ error: 'Failed to update medal' });
  }
});

// Delete a medal claim
router.delete('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const result = await pool.query(`
      DELETE FROM user_medals 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medal not found or not owned by user' });
    }
    
    res.json({ message: 'Medal claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting medal:', error);
    res.status(500).json({ error: 'Failed to delete medal' });
  }
});

export default router;
