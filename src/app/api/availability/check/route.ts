// src/app/api/availability/check/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

// GET - Get available time slots for booking (client-specific) - Database version
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001';
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '14');

    const pool = getPool();

    // Get client's weekly schedule from database
    const availabilityResult = await pool.query(
      'SELECT day_of_week, enabled, start_time, end_time FROM availability WHERE client_id = $1',
      [clientId]
    );

    if (availabilityResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client availability not found' },
        { status: 404 }
      );
    }

    // Transform to expected format
    const weeklySchedule: any = {};
    availabilityResult.rows.forEach((row: any) => {
      weeklySchedule[row.day_of_week] = {
        enabled: row.enabled,
        start: row.start_time,
        end: row.end_time
      };
    });
    
    // Get client's existing appointments from database
    const appointmentsResult = await pool.query(
      'SELECT date, time FROM appointments WHERE client_id = $1 AND status != $2',
      [clientId, 'cancelled']
    );

    const existingAppointments = appointmentsResult.rows.map((row: any) => ({
      date: row.date,
      time: row.time
    }));
    
    // Get client's settings from database
    const settingsResult = await pool.query(
      'SELECT duration, buffer_time, advance_notice, max_booking_window FROM client_settings WHERE client_id = $1',
      [clientId]
    );

    const settings = settingsResult.rows.length > 0 ? {
      duration: settingsResult.rows[0].duration,
      bufferTime: settingsResult.rows[0].buffer_time,
      advanceNotice: settingsResult.rows[0].advance_notice,
      maxBookingWindow: settingsResult.rows[0].max_booking_window
    } : {
      duration: 45,
      bufferTime: 15,
      advanceNotice: 24,
      maxBookingWindow: 60
    };

    // Get blackout dates from database
    const blackoutResult = await pool.query(
      'SELECT date FROM blackout_dates WHERE client_id = $1',
      [clientId]
    );

    const blackoutDates = blackoutResult.rows.map((row: any) => row.date.toISOString().split('T')[0]);

    console.log('Availability checker using data:', {
      clientId,
      weeklySchedule,
      settings,
      appointmentCount: existingAppointments.length,
      blackoutDates: blackoutDates
    });

    // Generate available time slots
    const availableSlots = generateAvailableSlots(
      startDate,
      days,
      weeklySchedule,
      blackoutDates,
      existingAppointments,
      settings
    );

    return NextResponse.json({
      success: true,
      client: clientId,
      data: {
        availableSlots,
        settings,
        blackoutDates
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

// Main function to generate available slots - Same logic as before
function generateAvailableSlots(
  startDate: string,
  days: number,
  weeklySchedule: any,
  blackoutDates: string[],
  existingAppointments: any[],
  settings: any
) {
  const slots = [];
  
  // Create date in local timezone to avoid UTC conversion issues
  const [year, month, day] = startDate.split('-').map(Number);
  const currentDate = new Date(year, month - 1, day); // month is 0-indexed
  
  const minBookingTime = new Date();
  minBookingTime.setHours(minBookingTime.getHours() + settings.advanceNotice);

  for (let i = 0; i < days; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Use getDay() consistently since we're working in local timezone
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    console.log(`Processing date: ${dateStr}, day: ${dayName}, dayOfWeek: ${dayOfWeek}`);

    // Skip if not available on this day
    const daySchedule = weeklySchedule[dayName];
    if (!daySchedule || !daySchedule.enabled) {
      console.log(`Skipping ${dateStr} (${dayName}) - not available`);
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Skip blackout dates
    if (blackoutDates.includes(dateStr)) {
      console.log(`Skipping ${dateStr} - blackout date`);
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Skip if date is too soon (within advance notice period)
    if (currentDate < minBookingTime) {
      console.log(`Skipping ${dateStr} - within advance notice period`);
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Generate time slots for this day
    const daySlots = generateDaySlots(
      dateStr,
      daySchedule,
      existingAppointments,
      settings
    );

    if (daySlots.length > 0) {
      slots.push({
        date: dateStr,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        slots: daySlots
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

function generateDaySlots(
  date: string,
  daySchedule: any,
  existingAppointments: any[],
  settings: any
) {
  const slots = [];
  
  // Parse start and end times
  const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
  const [endHour, endMinute] = daySchedule.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute; // minutes from midnight
  const endTime = endHour * 60 + endMinute;
  
  // Generate slots with buffer time
  let currentTime = startTime;
  
  while (currentTime + settings.duration <= endTime) {
    const slotHour = Math.floor(currentTime / 60);
    const slotMinute = currentTime % 60;
    const timeStr = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;
    
    // Check if this slot conflicts with existing appointments
    const hasConflict = existingAppointments.some((apt: any) => 
      apt.date.toISOString().split('T')[0] === date && apt.time === timeStr
    );
    
    if (!hasConflict) {
      // Format for display (12-hour format)
      const displayHour = slotHour === 0 ? 12 : slotHour > 12 ? slotHour - 12 : slotHour;
      const ampm = slotHour >= 12 ? 'PM' : 'AM';
      const displayTime = `${displayHour}:${slotMinute.toString().padStart(2, '0')} ${ampm}`;
      
      slots.push({
        time: displayTime,
        value: timeStr
      });
    }
    
    // Move to next slot (duration + buffer time)
    currentTime += settings.duration + settings.bufferTime;
  }
  
  return slots;
}