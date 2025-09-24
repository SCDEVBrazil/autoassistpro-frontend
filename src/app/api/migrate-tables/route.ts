// src/app/api/migrate-tables/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

export async function GET() {
  try {
    const pool = getPool();
    
    console.log('Starting additional table migration...');

    // Create availability table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS availability (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(100) NOT NULL,
        day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
        enabled BOOLEAN DEFAULT false,
        start_time TIME NOT NULL DEFAULT '09:00',
        end_time TIME NOT NULL DEFAULT '17:00',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(client_id, day_of_week)
      );
    `);

    // Create settings table  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_settings (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(100) UNIQUE NOT NULL,
        duration INTEGER DEFAULT 45,
        buffer_time INTEGER DEFAULT 15,
        advance_notice INTEGER DEFAULT 24,
        max_booking_window INTEGER DEFAULT 60,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create blackout dates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blackout_dates (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        reason VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(client_id, date)
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_availability_client_day ON availability(client_id, day_of_week);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blackout_dates_client_date ON blackout_dates(client_id, date);
    `);

    console.log('Tables created, now inserting default data...');

    // Insert default availability data
    await pool.query(`
      INSERT INTO availability (client_id, day_of_week, enabled, start_time, end_time) VALUES
      ('techequity', 'monday', false, '09:00', '17:00'),
      ('techequity', 'tuesday', false, '09:00', '17:00'), 
      ('techequity', 'wednesday', false, '09:00', '17:00'),
      ('techequity', 'thursday', false, '09:00', '17:00'),
      ('techequity', 'friday', true, '09:00', '16:00'),
      ('techequity', 'saturday', false, '09:00', '17:00'),
      ('techequity', 'sunday', false, '09:00', '17:00'),
      ('autoassist-demo', 'monday', true, '09:00', '17:00'),
      ('autoassist-demo', 'tuesday', true, '09:00', '17:00'),
      ('autoassist-demo', 'wednesday', true, '09:00', '17:00'), 
      ('autoassist-demo', 'thursday', true, '09:00', '17:00'),
      ('autoassist-demo', 'friday', true, '09:00', '17:00'),
      ('autoassist-demo', 'saturday', false, '09:00', '17:00'),
      ('autoassist-demo', 'sunday', false, '09:00', '17:00')
      ON CONFLICT (client_id, day_of_week) DO NOTHING;
    `);

    // Insert default settings
    await pool.query(`
      INSERT INTO client_settings (client_id, duration, buffer_time, advance_notice, max_booking_window) VALUES
      ('techequity', 45, 15, 24, 60),
      ('autoassist-demo', 30, 15, 2, 30)
      ON CONFLICT (client_id) DO NOTHING;
    `);

    // Insert default blackout dates
    await pool.query(`
      INSERT INTO blackout_dates (client_id, date, reason) VALUES
      ('techequity', '2024-12-25', 'Christmas Day'),
      ('techequity', '2024-12-31', 'New Year''s Eve'),
      ('techequity', '2025-01-01', 'New Year''s Day'),
      ('autoassist-demo', '2024-12-25', 'Christmas Day')
      ON CONFLICT (client_id, date) DO NOTHING;
    `);

    console.log('Migration completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Additional database tables created and populated successfully!',
      tables: ['availability', 'client_settings', 'blackout_dates'],
      indexes: ['idx_availability_client_day', 'idx_blackout_dates_client_date']
    });

  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown migration error'
    }, { status: 500 });
  }
}