// src/app/api/chat-logs/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHAT_LOGS_FILE = path.join(DATA_DIR, 'chat-logs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default chat logs data structure
const defaultChatLogsData = {
  'techequity': [],
  'autoassist-demo': []
};

// Helper function to get chat logs data
function getChatLogsData() {
  try {
    if (!fs.existsSync(CHAT_LOGS_FILE)) {
      fs.writeFileSync(CHAT_LOGS_FILE, JSON.stringify(defaultChatLogsData, null, 2));
      return defaultChatLogsData;
    }
    const data = fs.readFileSync(CHAT_LOGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chat logs data:', error);
    return defaultChatLogsData;
  }
}

// Helper function to save chat logs data
function saveChatLogsData(data: any) {
  try {
    fs.writeFileSync(CHAT_LOGS_FILE, JSON.stringify(data, null, 2));
    console.log('Chat logs data saved to file');
  } catch (error) {
    console.error('Error saving chat logs data:', error);
  }
}

// GET - Fetch chat logs for specific client and/or session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '100');

    const chatLogsData = getChatLogsData();

    // Initialize if client doesn't exist
    if (!chatLogsData[clientId]) {
      chatLogsData[clientId] = [];
    }

    let logs = chatLogsData[clientId];

    // Filter by session if specified
    if (sessionId) {
      logs = logs.filter((log: any) => log.sessionId === sessionId);
    }

    // Apply limit
    logs = logs.slice(-limit);

    return NextResponse.json({
      success: true,
      client: clientId,
      sessionId: sessionId || 'all',
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat logs' },
      { status: 500 }
    );
  }
}

// POST - Log a new chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      clientId,
      sessionId,
      messageType,
      content,
      userInfo
    } = body;

    // Validate required fields
    if (!clientId || !sessionId || !messageType || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: clientId, sessionId, messageType, content' },
        { status: 400 }
      );
    }

    // Create new chat log entry
    const newLogEntry = {
      id: Date.now(),
      clientId,
      sessionId,
      messageType, // 'user' or 'ai'
      content,
      userInfo: userInfo || null, // Optional user information
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Load current data and add new entry
    const chatLogsData = getChatLogsData();
    
    if (!chatLogsData[clientId]) {
      chatLogsData[clientId] = [];
    }

    chatLogsData[clientId].push(newLogEntry);
    saveChatLogsData(chatLogsData);

    console.log('Logged chat message for', clientId, sessionId, messageType);

    return NextResponse.json({
      success: true,
      message: 'Chat message logged successfully',
      client: clientId,
      sessionId: sessionId,
      data: newLogEntry
    });
  } catch (error) {
    console.error('Error logging chat message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log chat message' },
      { status: 500 }
    );
  }
}

// DELETE - Delete all messages for a specific session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';
    const sessionId = searchParams.get('sessionId');

    // Validate required parameters
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required for deletion' },
        { status: 400 }
      );
    }

    // Load current chat logs data
    const chatLogsData = getChatLogsData();

    // Initialize if client doesn't exist
    if (!chatLogsData[clientId]) {
      chatLogsData[clientId] = [];
    }

    // Count messages before deletion for logging
    const messagesBeforeDeletion = chatLogsData[clientId].length;
    const messagesToDelete = chatLogsData[clientId].filter((log: any) => log.sessionId === sessionId);
    
    if (messagesToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No conversation found with the specified session ID' },
        { status: 404 }
      );
    }

    // Remove all messages with the specified session ID
    chatLogsData[clientId] = chatLogsData[clientId].filter((log: any) => log.sessionId !== sessionId);
    
    // Save updated data back to file
    saveChatLogsData(chatLogsData);

    const messagesAfterDeletion = chatLogsData[clientId].length;
    const deletedCount = messagesBeforeDeletion - messagesAfterDeletion;

    console.log(`Deleted ${deletedCount} messages for session ${sessionId} from client ${clientId}`);

    return NextResponse.json({
      success: true,
      message: `Conversation deleted successfully. Removed ${deletedCount} messages.`,
      client: clientId,
      sessionId: sessionId,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}