// src/app/api/appointments/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getAppointmentsData, addAppointment } from '@/lib/file-storage';
import fs from 'fs';
import path from 'path';

// GET - Fetch all appointments for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const appointmentsData = getAppointmentsData();

    // Initialize if client doesn't exist
    if (!appointmentsData[clientId]) {
      appointmentsData[clientId] = [];
    }

    return NextResponse.json({
      success: true,
      client: clientId,
      data: appointmentsData[clientId]
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

    // Check for conflicts
    const appointmentsData = getAppointmentsData();
    if (!appointmentsData[clientId]) {
      appointmentsData[clientId] = [];
    }

    const existingAppointment = appointmentsData[clientId].find(
      (apt: { date: any; time: any; status: string; }) => apt.date === date && apt.time === time && apt.status !== 'cancelled'
    );

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    // Create new appointment
    const newAppointment = {
      id: appointmentsData[clientId].length + 1,
      firstName,
      lastName,
      email,
      phone: phone || '',
      company: company || '',
      interest: interest || 'general',
      date,
      time,
      status: 'confirmed',
      chatSessionId: chatSessionId || null, // Include chat session ID
      createdAt: new Date().toISOString()
    };

    // Save using file storage
    addAppointment(clientId, newAppointment);

    return NextResponse.json({
      success: true,
      message: 'Appointment created successfully',
      client: clientId,
      data: newAppointment
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

    const appointmentsData = getAppointmentsData();
    
    if (!appointmentsData[clientId]) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const appointmentIndex = appointmentsData[clientId].findIndex(
      (apt: any) => apt.id === parseInt(id)
    );

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check for conflicts with other appointments (excluding the current one)
    const conflictingAppointment = appointmentsData[clientId].find(
      (apt: any) => apt.id !== parseInt(id) && apt.date === date && apt.time === time && apt.status !== 'cancelled'
    );

    if (conflictingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Time slot already booked by another appointment' },
        { status: 409 }
      );
    }

    // Update the appointment
    const updatedAppointment = {
      ...appointmentsData[clientId][appointmentIndex],
      firstName,
      lastName,
      email,
      phone: phone || '',
      company: company || '',
      interest: interest || 'general',
      date,
      time,
      status: status || 'confirmed',
      chatSessionId: chatSessionId || appointmentsData[clientId][appointmentIndex].chatSessionId || null,
      updatedAt: new Date().toISOString()
    };

    appointmentsData[clientId][appointmentIndex] = updatedAppointment;

    // Save back to file storage
    const dataDir = path.join(process.cwd(), 'data');
    const appointmentsFile = path.join(dataDir, 'appointments.json');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(appointmentsFile, JSON.stringify(appointmentsData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      client: clientId,
      data: updatedAppointment
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

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointmentsData = getAppointmentsData();
    
    if (!appointmentsData[clientId]) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const appointmentIndex = appointmentsData[clientId].findIndex(
      (apt: any) => apt.id === parseInt(appointmentId)
    );

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Remove the appointment
    appointmentsData[clientId].splice(appointmentIndex, 1);
    
    // Save back to file storage
    const dataDir = path.join(process.cwd(), 'data');
    const appointmentsFile = path.join(dataDir, 'appointments.json');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(appointmentsFile, JSON.stringify(appointmentsData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
      client: clientId
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}