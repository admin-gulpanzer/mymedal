import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'ep-tiny-hall-ae346b8n-pooler.c-2.us-east-2.aws.neon.tech',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'neondb',
  user: process.env.DB_USER || 'neondb_owner',
  password: process.env.DB_PASSWORD || 'npg_JA0iIPQKoNc1',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
