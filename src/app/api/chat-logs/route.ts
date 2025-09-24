// src/app/api/chat-logs/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHAT_LOGS_FILE = path.join(DATA_DIR, 'chat-logs.json');

// Default chat logs data structure
const defaultChatLogsData = {
  'techequity': [],
  'autoassist-demo': []
};

// Helper function to get chat logs data
function getChatLogsData() {
  try {
    if (!fs.existsSync(CHAT_LOGS_FILE)) {
      // Try to create file, but don't fail if we can't
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(CHAT_LOGS_FILE, JSON.stringify(defaultChatLogsData, null, 2));
      } catch (writeError) {
        console.warn('Cannot create chat-logs file (production environment):', writeError);
      }
      return defaultChatLogsData;
    }
    const data = fs.readFileSync(CHAT_LOGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chat logs data:', error);
    return defaultChatLogsData;
  }
}

// Helper function to save chat logs data - Production safe
function saveChatLogsData(data: any) {
  try {
    // Check if we can write to filesystem
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (dirError) {
        console.warn('Cannot create data directory in production:', dirError);
        return false; // Indicate write failed
      }
    }
    
    try {
      fs.writeFileSync(CHAT_LOGS_FILE, JSON.stringify(data, null, 2));
      console.log('Chat logs data saved to file');
      return true; // Indicate write succeeded
    } catch (writeError) {
      console.warn('Cannot write chat logs in production (expected):', writeError);
      return false; // Indicate write failed
    }
  } catch (error) {
    console.error('Error saving chat logs data:', error);
    return false;
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

// POST - Log a new chat message - Production safe
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

    console.log('Attempting to log chat message:', { clientId, sessionId, messageType, content: content.substring(0, 50) + '...' });

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
    
    // Try to save, but don't fail if we can't
    const writeSuccess = saveChatLogsData(chatLogsData);
    
    if (writeSuccess) {
      console.log('Chat message logged and persisted for', clientId, sessionId, messageType);
    } else {
      console.log('Chat message logged in memory only for', clientId, sessionId, messageType);
    }

    return NextResponse.json({
      success: true,
      message: writeSuccess 
        ? 'Chat message logged successfully' 
        : 'Chat message logged (in memory only - production environment)',
      client: clientId,
      sessionId: sessionId,
      data: newLogEntry,
      persisted: writeSuccess
    });
  } catch (error) {
    console.error('Error logging chat message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log chat message' },
      { status: 500 }
    );
  }
}

// DELETE - Delete all messages for a specific session - Production safe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';
    const sessionId = searchParams.get('sessionId');

    console.log('DELETE chat logs request:', { clientId, sessionId });

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

    // Remove all messages with the specified session ID from memory
    chatLogsData[clientId] = chatLogsData[clientId].filter((log: any) => log.sessionId !== sessionId);
    
    // Try to save updated data back to file, but don't fail if we can't
    const writeSuccess = saveChatLogsData(chatLogsData);

    const messagesAfterDeletion = chatLogsData[clientId].length;
    const deletedCount = messagesBeforeDeletion - messagesAfterDeletion;

    if (writeSuccess) {
      console.log(`Deleted and persisted ${deletedCount} messages for session ${sessionId} from client ${clientId}`);
    } else {
      console.log(`Deleted ${deletedCount} messages from memory for session ${sessionId} from client ${clientId} (production environment)`);
    }

    return NextResponse.json({
      success: true,
      message: writeSuccess 
        ? `Conversation deleted successfully. Removed ${deletedCount} messages.`
        : `Conversation deleted from memory (${deletedCount} messages). Changes not persisted due to production environment.`,
      client: clientId,
      sessionId: sessionId,
      deletedCount: deletedCount,
      persisted: writeSuccess
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}