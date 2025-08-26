import { Pool } from 'pg';

const pool = new Pool({
  host: 'ep-tiny-hall-ae346b8n-pooler.c-2.us-east-2.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_JA0iIPQKoNc1',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
