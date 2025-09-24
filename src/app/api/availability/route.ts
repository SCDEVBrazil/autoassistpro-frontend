// src/app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

// GET - Fetch current availability for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const pool = getPool();
    
    // Get availability data from database
    const result = await pool.query(
      'SELECT day_of_week, enabled, start_time, end_time FROM availability WHERE client_id = $1 ORDER BY CASE day_of_week WHEN \'monday\' THEN 1 WHEN \'tuesday\' THEN 2 WHEN \'wednesday\' THEN 3 WHEN \'thursday\' THEN 4 WHEN \'friday\' THEN 5 WHEN \'saturday\' THEN 6 WHEN \'sunday\' THEN 7 END',
      [clientId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format
    const schedule: any = {};
    result.rows.forEach((row: any) => {
      schedule[row.day_of_week] = {
        enabled: row.enabled,
        start: row.start_time,
        end: row.end_time
      };
    });

    return NextResponse.json({
      success: true,
      client: clientId,
      data: schedule
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// POST - Update availability for specific client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, schedule } = body;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!schedule) {
      return NextResponse.json(
        { success: false, error: 'Schedule data is required' },
        { status: 400 }
      );
    }

    // Validate schedule format
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of validDays) {
      if (!schedule[day]) {
        return NextResponse.json(
          { success: false, error: `Missing schedule for ${day}` },
          { status: 400 }
        );
      }
    }

    const pool = getPool();

    // Update each day's schedule in the database
    for (const day of validDays) {
      const dayData = schedule[day];
      await pool.query(`
        INSERT INTO availability (client_id, day_of_week, enabled, start_time, end_time, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (client_id, day_of_week) 
        DO UPDATE SET 
          enabled = EXCLUDED.enabled,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          updated_at = NOW()
      `, [clientId, day, dayData.enabled, dayData.start, dayData.end]);
    }

    // Fetch updated schedule to return
    const result = await pool.query(
      'SELECT day_of_week, enabled, start_time, end_time FROM availability WHERE client_id = $1',
      [clientId]
    );

    const updatedSchedule: any = {};
    result.rows.forEach((row: any) => {
      updatedSchedule[row.day_of_week] = {
        enabled: row.enabled,
        start: row.start_time,
        end: row.end_time
      };
    });

    console.log('Updated availability for', clientId, updatedSchedule);

    return NextResponse.json({
      success: true,
      message: 'Availability updated successfully',
      client: clientId,
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}