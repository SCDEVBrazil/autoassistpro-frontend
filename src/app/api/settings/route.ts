// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

// GET - Fetch current settings for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001';

    const pool = getPool();
    
    // Get settings from database
    const result = await pool.query(
      'SELECT duration, buffer_time, advance_notice, max_booking_window FROM client_settings WHERE client_id = $1',
      [clientId]
    );

    let settings;
    if (result.rows.length === 0) {
      // Create default settings if they don't exist
      const defaultSettings = {
        duration: 45,
        bufferTime: 15,
        advanceNotice: 24,
        maxBookingWindow: 60
      };

      await pool.query(`
        INSERT INTO client_settings (client_id, duration, buffer_time, advance_notice, max_booking_window)
        VALUES ($1, $2, $3, $4, $5)
      `, [clientId, defaultSettings.duration, defaultSettings.bufferTime, defaultSettings.advanceNotice, defaultSettings.maxBookingWindow]);

      settings = defaultSettings;
    } else {
      // Transform database result to match expected format
      const row = result.rows[0];
      settings = {
        duration: row.duration,
        bufferTime: row.buffer_time,
        advanceNotice: row.advance_notice,
        maxBookingWindow: row.max_booking_window
      };
    }

    console.log(`Retrieved settings for client ${clientId}:`, settings);

    return NextResponse.json({
      success: true,
      client: clientId,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Update settings for specific client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, duration, bufferTime, advanceNotice, maxBookingWindow } = body;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Validate settings values
    if (duration && (duration < 15 || duration > 240)) {
      return NextResponse.json(
        { success: false, error: 'Duration must be between 15 and 240 minutes' },
        { status: 400 }
      );
    }

    if (bufferTime && (bufferTime < 0 || bufferTime > 60)) {
      return NextResponse.json(
        { success: false, error: 'Buffer time must be between 0 and 60 minutes' },
        { status: 400 }
      );
    }

    if (advanceNotice && (advanceNotice < 0 || advanceNotice > 168)) {
      return NextResponse.json(
        { success: false, error: 'Advance notice must be between 0 and 168 hours' },
        { status: 400 }
      );
    }

    if (maxBookingWindow && (maxBookingWindow < 1 || maxBookingWindow > 365)) {
      return NextResponse.json(
        { success: false, error: 'Max booking window must be between 1 and 365 days' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Prepare updated settings with defaults
    const updatedSettings = {
      duration: duration || 45,
      bufferTime: bufferTime || 15,
      advanceNotice: advanceNotice || 24,
      maxBookingWindow: maxBookingWindow || 60
    };

    // Insert or update settings
    await pool.query(`
      INSERT INTO client_settings (client_id, duration, buffer_time, advance_notice, max_booking_window, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (client_id) 
      DO UPDATE SET 
        duration = EXCLUDED.duration,
        buffer_time = EXCLUDED.buffer_time,
        advance_notice = EXCLUDED.advance_notice,
        max_booking_window = EXCLUDED.max_booking_window,
        updated_at = NOW()
    `, [clientId, updatedSettings.duration, updatedSettings.bufferTime, updatedSettings.advanceNotice, updatedSettings.maxBookingWindow]);

    console.log('Updated settings for', clientId, updatedSettings);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      client: clientId,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}