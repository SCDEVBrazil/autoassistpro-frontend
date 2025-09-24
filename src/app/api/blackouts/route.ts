// src/app/api/blackouts/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLACKOUTS_FILE = path.join(DATA_DIR, 'blackouts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default blackout data structure
const defaultBlackoutData = {
  'techequity': [
    { id: 1, date: '2024-12-25', reason: 'Christmas Day' },
    { id: 2, date: '2024-12-31', reason: 'New Year\'s Eve' },
    { id: 3, date: '2025-01-01', reason: 'New Year\'s Day' }
  ],
  'autoassist-demo': [
    { id: 1, date: '2024-12-25', reason: 'Christmas Day' }
  ]
};

// Helper function to get blackout data
function getBlackoutData() {
  try {
    if (!fs.existsSync(BLACKOUTS_FILE)) {
      fs.writeFileSync(BLACKOUTS_FILE, JSON.stringify(defaultBlackoutData, null, 2));
      return defaultBlackoutData;
    }
    const data = fs.readFileSync(BLACKOUTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blackout data:', error);
    return defaultBlackoutData;
  }
}

// Helper function to save blackout data
function saveBlackoutData(data: any) {
  try {
    fs.writeFileSync(BLACKOUTS_FILE, JSON.stringify(data, null, 2));
    console.log('Blackout data saved to file');
  } catch (error) {
    console.error('Error saving blackout data:', error);
  }
}

// GET - Fetch all blackout dates for specific client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';

    const blackoutData = getBlackoutData();

    // Initialize client blackouts if doesn't exist
    if (!blackoutData[clientId]) {
      blackoutData[clientId] = [];
    }

    return NextResponse.json({
      success: true,
      client: clientId,
      data: blackoutData[clientId]
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

    const blackoutData = getBlackoutData();

    // Initialize client blackouts if doesn't exist
    if (!blackoutData[clientId]) {
      blackoutData[clientId] = [];
    }

    // Check if date already exists for this client
    const existingBlackout = blackoutData[clientId].find((blackout: any) => blackout.date === date);
    if (existingBlackout) {
      return NextResponse.json(
        { success: false, error: 'Blackout date already exists for this client' },
        { status: 409 }
      );
    }

    // Generate new ID
    const maxId = blackoutData[clientId].length > 0 
      ? Math.max(...blackoutData[clientId].map((b: any) => b.id))
      : 0;

    const newBlackout = {
      id: maxId + 1,
      date,
      reason
    };

    blackoutData[clientId].push(newBlackout);
    saveBlackoutData(blackoutData);

    console.log('Added blackout date for', clientId, newBlackout);

    return NextResponse.json({
      success: true,
      message: 'Blackout date added successfully',
      client: clientId,
      data: newBlackout
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
    const id = searchParams.get('id');
    const clientId = searchParams.get('client') || 'techequity';

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const blackoutData = getBlackoutData();

    if (!blackoutData[clientId]) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const blackoutIndex = blackoutData[clientId].findIndex((blackout: any) => blackout.id === parseInt(id));
    if (blackoutIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Blackout date not found' },
        { status: 404 }
      );
    }

    blackoutData[clientId].splice(blackoutIndex, 1);
    saveBlackoutData(blackoutData);

    console.log('Removed blackout date for', clientId, 'ID:', id);

    return NextResponse.json({
      success: true,
      message: 'Blackout date removed successfully',
      client: clientId
    });
  } catch (error) {
    console.error('Error removing blackout date:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove blackout date' },
      { status: 500 }
    );
  }
}