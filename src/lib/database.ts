// src/lib/database.ts
import { Pool } from 'pg';

// Database connection pool
let pool: Pool | null = null;

// Initialize database connection
export function getPool(): Pool {
  if (!pool) {
    // Since you're using Railway PostgreSQL, the connection URL should be in environment variables
    // We'll use the same database that your n8n instance is connected to
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10, // Maximum number of connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle connection errors
    pool.on('error', (err) => {
      console.error('Database connection error:', err);
    });

    console.log('PostgreSQL connection pool initialized');
  }
  
  return pool;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database tables
export async function initializeTables(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    console.log('Creating database tables...');

    // Create appointments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(100) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        interest VARCHAR(255),
        date DATE NOT NULL,
        time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        chat_session_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create chat_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_logs (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(100) NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        message_type VARCHAR(10) NOT NULL CHECK (message_type IN ('user', 'ai')),
        content TEXT NOT NULL,
        user_info JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_client_date ON appointments(client_id, date);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
      CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);
      CREATE INDEX IF NOT EXISTS idx_chat_logs_client_timestamp ON chat_logs(client_id, timestamp);
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Close database connections (for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection pool closed');
  }
}