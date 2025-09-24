// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSettingsData, updateSettings } from '@/lib/file-storage';

// GET - Fetch current settings for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const settingsData = getSettingsData();

    // Initialize default settings if client doesn't exist
    if (!settingsData[clientId]) {
      settingsData[clientId] = {
        duration: 45,
        bufferTime: 15,
        advanceNotice: 24,
        maxBookingWindow: 60
      };
    }

    return NextResponse.json({
      success: true,
      client: clientId,
      data: settingsData[clientId]
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

    const updatedSettings = {
      duration: duration || 45,
      bufferTime: bufferTime || 15,
      advanceNotice: advanceNotice || 24,
      maxBookingWindow: maxBookingWindow || 60
    };

    updateSettings(clientId, updatedSettings);

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