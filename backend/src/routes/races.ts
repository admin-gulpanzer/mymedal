import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { Race } from '../types';
import { optionalAuth } from '../middleware/auth';

const router: Router = Router();

// Get all races
router.get('/', optionalAuth, async (req, res) => {
  try {
    console.log('Attempting to fetch races...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    const result = await pool.query(`
      SELECT r.*, 
             COUNT(um.id) as total_medals_claimed
      FROM races r
      LEFT JOIN user_medals um ON r.id = um.race_id
      GROUP BY r.id
      ORDER BY r.date DESC
    `);
    
    console.log('Query successful, found', result.rows.length, 'races');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching races:', error);
    console.error('Database URL:', process.env.DATABASE_URL);
    res.status(500).json({ error: 'Failed to fetch races', details: (error as Error).message });
  }
});

// Get race by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*,
             COUNT(um.id) as total_medals_claimed
      FROM races r
      LEFT JOIN user_medals um ON r.id = um.race_id
      WHERE r.id = $1
      GROUP BY r.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Race not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching race:', error);
    res.status(500).json({ error: 'Failed to fetch race' });
  }
});

// Get race stats for a specific race
router.get('/:id/stats', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT rs.*
      FROM race_stats rs
      WHERE rs.race_id = $1
      ORDER BY rs.overall_place ASC NULLS LAST
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching race stats:', error);
    res.status(500).json({ error: 'Failed to fetch race stats' });
  }
});

export default router;
