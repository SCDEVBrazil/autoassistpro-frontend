// src/app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAvailabilityData, saveAvailabilityData } from '@/lib/file-storage';

// GET - Fetch current availability for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const availabilityData = getAvailabilityData();

    // Validate client exists
    if (!availabilityData[clientId]) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      client: clientId,
      data: availabilityData[clientId]
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

    // Load current data, update it, and save back to file
    const availabilityData = getAvailabilityData();
    availabilityData[clientId] = { ...schedule };
    saveAvailabilityData(availabilityData);

    console.log('Updated availability for', clientId, schedule);

    return NextResponse.json({
      success: true,
      message: 'Availability updated successfully',
      client: clientId,
      data: availabilityData[clientId]
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}