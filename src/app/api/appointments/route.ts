// src/app/api/appointments/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

// GET - Fetch all appointments for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM appointments WHERE client_id = $1 ORDER BY date DESC, time DESC',
      [clientId]
    );

    // Transform database results to match existing format
    const appointments = result.rows.map((row: any) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone || '',
      company: row.company || '',
      interest: row.interest || 'general',
      date: row.date,
      time: row.time,
      status: row.status,
      chatSessionId: row.chat_session_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({
      success: true,
      client: clientId,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST - Create new appointment for specific client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      clientId,
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      interest, 
      date, 
      time,
      chatSessionId
    } = body;

    // Validate required fields
    if (!clientId || !firstName || !lastName || !email || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check for conflicts
    const conflictResult = await pool.query(
      'SELECT id FROM appointments WHERE client_id = $1 AND date = $2 AND time = $3 AND status != $4',
      [clientId, date, time, 'cancelled']
    );

    if (conflictResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    // Create new appointment
    const result = await pool.query(`
      INSERT INTO appointments (
        client_id, first_name, last_name, email, phone, company, 
        interest, date, time, status, chat_session_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      clientId,
      firstName,
      lastName,
      email,
      phone || null,
      company || null,
      interest || 'general',
      date,
      time,
      'confirmed',
      chatSessionId || null
    ]);

    const newAppointment = result.rows[0];

    // Transform to match existing format
    const formattedAppointment = {
      id: newAppointment.id,
      firstName: newAppointment.first_name,
      lastName: newAppointment.last_name,
      email: newAppointment.email,
      phone: newAppointment.phone || '',
      company: newAppointment.company || '',
      interest: newAppointment.interest || 'general',
      date: newAppointment.date,
      time: newAppointment.time,
      status: newAppointment.status,
      chatSessionId: newAppointment.chat_session_id,
      createdAt: newAppointment.created_at
    };

    console.log('Created appointment:', formattedAppointment);

    return NextResponse.json({
      success: true,
      message: 'Appointment created successfully',
      client: clientId,
      data: formattedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PUT - Update existing appointment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      clientId,
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      interest, 
      date, 
      time,
      status,
      chatSessionId
    } = body;

    // Validate required fields
    if (!id || !clientId || !firstName || !lastName || !email || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if appointment exists
    const existingResult = await pool.query(
      'SELECT id FROM appointments WHERE id = $1 AND client_id = $2',
      [id, clientId]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check for conflicts with other appointments (excluding the current one)
    const conflictResult = await pool.query(
      'SELECT id FROM appointments WHERE client_id = $1 AND date = $2 AND time = $3 AND id != $4 AND status != $5',
      [clientId, date, time, id, 'cancelled']
    );

    if (conflictResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Time slot already booked by another appointment' },
        { status: 409 }
      );
    }

    // Update the appointment
    const result = await pool.query(`
      UPDATE appointments 
      SET first_name = $1, last_name = $2, email = $3, phone = $4, company = $5,
          interest = $6, date = $7, time = $8, status = $9, chat_session_id = $10,
          updated_at = NOW()
      WHERE id = $11 AND client_id = $12
      RETURNING *
    `, [
      firstName,
      lastName,
      email,
      phone || null,
      company || null,
      interest || 'general',
      date,
      time,
      status || 'confirmed',
      chatSessionId || null,
      id,
      clientId
    ]);

    const updatedAppointment = result.rows[0];

    // Transform to match existing format
    const formattedAppointment = {
      id: updatedAppointment.id,
      firstName: updatedAppointment.first_name,
      lastName: updatedAppointment.last_name,
      email: updatedAppointment.email,
      phone: updatedAppointment.phone || '',
      company: updatedAppointment.company || '',
      interest: updatedAppointment.interest || 'general',
      date: updatedAppointment.date,
      time: updatedAppointment.time,
      status: updatedAppointment.status,
      chatSessionId: updatedAppointment.chat_session_id,
      createdAt: updatedAppointment.created_at,
      updatedAt: updatedAppointment.updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      client: clientId,
      data: formattedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE - Remove appointment for specific client
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('id');
    const clientId = searchParams.get('client') || 'techequity';

    console.log('DELETE request:', { appointmentId, clientId });

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if appointment exists
    const existingResult = await pool.query(
      'SELECT id FROM appointments WHERE id = $1 AND client_id = $2',
      [appointmentId, clientId]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Delete the appointment
    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 AND client_id = $2 RETURNING id',
      [appointmentId, clientId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete appointment' },
        { status: 500 }
      );
    }

    console.log(`Successfully deleted appointment ${appointmentId} for client ${clientId}`);

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
      client: clientId,
      deletedId: parseInt(appointmentId)
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}