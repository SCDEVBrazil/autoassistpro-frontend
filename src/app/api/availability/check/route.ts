// src/app/api/availability/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAvailabilityData, getAppointmentsData, getSettingsData } from '@/lib/file-storage';

// Helper function to get blackout dates from the blackouts API
async function getBlackoutDates(clientId: string): Promise<string[]> {
  try {
    // Import the blackouts data directly from file storage
    const fs = require('fs');
    const path = require('path');
    
    const DATA_DIR = path.join(process.cwd(), 'data');
    const BLACKOUTS_FILE = path.join(DATA_DIR, 'blackouts.json');
    
    // Default blackouts data structure
    const defaultBlackoutsData = {
      'techequity': [
        { id: 1, date: '2024-12-25', reason: 'Christmas Day' },
        { id: 2, date: '2024-12-31', reason: 'New Year\'s Eve' },
        { id: 3, date: '2025-01-01', reason: 'New Year\'s Day' }
      ],
      'autoassist-demo': [
        { id: 1, date: '2024-12-25', reason: 'Christmas Day' }
      ]
    };

    let blackoutsData;
    try {
      if (!fs.existsSync(BLACKOUTS_FILE)) {
        fs.writeFileSync(BLACKOUTS_FILE, JSON.stringify(defaultBlackoutsData, null, 2));
        blackoutsData = defaultBlackoutsData;
      } else {
        const data = fs.readFileSync(BLACKOUTS_FILE, 'utf8');
        blackoutsData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading blackouts data:', error);
      blackoutsData = defaultBlackoutsData;
    }

    // Initialize client blackouts if doesn't exist
    if (!blackoutsData[clientId]) {
      blackoutsData[clientId] = [];
    }

    // Extract just the dates as strings
    return blackoutsData[clientId].map((blackout: any) => blackout.date);
  } catch (error) {
    console.error('Error getting blackout dates:', error);
    // Return default blackouts as fallback
    return ['2024-12-25', '2024-12-31', '2025-01-01'];
  }
}

// GET - Get available time slots for booking (client-specific)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const days = parseInt(searchParams.get('days') || '14');

    // Get client's weekly schedule from file storage
    const availabilityData = getAvailabilityData();
    const weeklySchedule = availabilityData[clientId] || availabilityData['techequity'];
    
    // Get client's existing appointments from file storage
    const appointmentsData = getAppointmentsData();
    const existingAppointments = appointmentsData[clientId] || [];
    
    // Get client's settings from file storage
    const settingsData = getSettingsData();
    const settings = settingsData[clientId] || settingsData['techequity'] || {
      duration: 45,
      bufferTime: 15,
      advanceNotice: 24,
      maxBookingWindow: 60
    };

    // Get dynamic blackout dates from the blackouts API/file
    const blackoutDates = await getBlackoutDates(clientId);

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
        blackoutDates // Include in response for debugging
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

// Main function to generate available slots - FIXED TIMEZONE HANDLING
function generateAvailableSlots(
  startDate: string,
  days: number,
  weeklySchedule: any,
  blackoutDates: string[],
  existingAppointments: any[],
  settings: any
) {
  const slots = [];
  
  // FIX: Create date in local timezone to avoid UTC conversion issues
  const [year, month, day] = startDate.split('-').map(Number);
  const currentDate = new Date(year, month - 1, day); // month is 0-indexed
  
  const minBookingTime = new Date();
  minBookingTime.setHours(minBookingTime.getHours() + settings.advanceNotice);

  for (let i = 0; i < days; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // FIX: Use getDay() consistently since we're working in local timezone
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

    // Skip blackout dates - NOW USING DYNAMIC BLACKOUT DATES
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
        dayName: currentDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        slots: daySlots
      });
      console.log(`Added ${daySlots.length} slots for ${dateStr} (${dayName})`);
    } else {
      console.log(`No available slots for ${dateStr} (${dayName})`);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

// Generate time slots for a specific day
function generateDaySlots(
  date: string,
  daySchedule: any,
  existingAppointments: any[],
  settings: any
) {
  const slots = [];
  const startTime = parseTime(daySchedule.start);
  const endTime = parseTime(daySchedule.end);
  const slotDuration = settings.duration + settings.bufferTime;

  // Get existing appointments for this day
  const dayAppointments = existingAppointments
    .filter(apt => apt.date === date)
    .map(apt => parseTime(convertTo24Hour(apt.time)));

  let currentSlot = startTime;
  while (currentSlot + settings.duration <= endTime) {
    const slotEndTime = currentSlot + settings.duration;
    
    // Check if this slot conflicts with existing appointments
    const hasConflict = dayAppointments.some(aptTime => {
      return (currentSlot < aptTime + settings.duration && slotEndTime > aptTime);
    });

    if (!hasConflict) {
      slots.push({
        time: formatTime(currentSlot),
        value: formatTime(currentSlot)
      });
    }

    currentSlot += slotDuration;
  }

  return slots;
}

// Convert time string to minutes (e.g., "09:30" -> 570)
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to time string (e.g., 570 -> "9:30 AM")
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Convert 12-hour format to 24-hour format (e.g., "2:00 PM" -> "14:00")
function convertTo24Hour(timeStr: string): string {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
}