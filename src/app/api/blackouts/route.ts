// src/app/api/blackouts/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

// GET - Fetch all blackout dates for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const pool = getPool();
    
    // Get blackout dates from database, ordered by date
    const result = await pool.query(
      'SELECT id, date, reason, created_at FROM blackout_dates WHERE client_id = $1 ORDER BY date ASC',
      [clientId]
    );

    // Transform to match expected format
    const blackoutDates = result.rows.map((row: any) => ({
      id: row.id,
      date: row.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      reason: row.reason,
      createdAt: row.created_at
    }));

    console.log(`Retrieved ${blackoutDates.length} blackout dates for client ${clientId}`);

    return NextResponse.json({
      success: true,
      client: clientId,
      data: blackoutDates
    });
  } catch (error) {
    console.error('Error fetching blackout dates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blackout dates' },
      { status: 500 }
    );
  }
}

// POST - Add new blackout date for specific client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, date, reason } = body;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!date || !reason) {
      return NextResponse.json(
        { success: false, error: 'Date and reason are required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if date already exists for this client
    const existingResult = await pool.query(
      'SELECT id FROM blackout_dates WHERE client_id = $1 AND date = $2',
      [clientId, date]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Blackout date already exists for this client' },
        { status: 409 }
      );
    }

    // Insert new blackout date
    const result = await pool.query(`
      INSERT INTO blackout_dates (client_id, date, reason)
      VALUES ($1, $2, $3)
      RETURNING id, date, reason, created_at
    `, [clientId, date, reason.trim()]);

    const newBlackout = result.rows[0];

    // Transform to match expected format
    const formattedBlackout = {
      id: newBlackout.id,
      date: newBlackout.date.toISOString().split('T')[0],
      reason: newBlackout.reason,
      createdAt: newBlackout.created_at
    };

    console.log('Added blackout date:', formattedBlackout);

    return NextResponse.json({
      success: true,
      message: 'Blackout date added successfully',
      client: clientId,
      data: formattedBlackout
    });
  } catch (error) {
    console.error('Error adding blackout date:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add blackout date' },
      { status: 500 }
    );
  }
}

// DELETE - Remove blackout date for specific client
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blackoutId = searchParams.get('id');
    const clientId = searchParams.get('client') || 'techequity';

    if (!blackoutId) {
      return NextResponse.json(
        { success: false, error: 'Blackout ID is required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if blackout exists for this client
    const existingResult = await pool.query(
      'SELECT id, date FROM blackout_dates WHERE id = $1 AND client_id = $2',
      [blackoutId, clientId]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Blackout date not found' },
        { status: 404 }
      );
    }

    // Delete the blackout date
    const deleteResult = await pool.query(
      'DELETE FROM blackout_dates WHERE id = $1 AND client_id = $2 RETURNING id',
      [blackoutId, clientId]
    );

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete blackout date' },
        { status: 500 }
      );
    }

    console.log(`Successfully deleted blackout date ${blackoutId} for client ${clientId}`);

    return NextResponse.json({
      success: true,
      message: 'Blackout date deleted successfully',
      client: clientId,
      deletedId: parseInt(blackoutId)
    });
  } catch (error) {
    console.error('Error deleting blackout date:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blackout date' },
      { status: 500 }
    );
  }
}