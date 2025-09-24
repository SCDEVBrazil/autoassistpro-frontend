// src/app/api/chat-logs/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

// GET - Fetch chat logs for specific client and/or session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client') || 'techequity';
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '100');

    const pool = getPool();
    let query = '';
    let params: any[] = [];

    if (sessionId) {
      // Get specific session messages
      query = `
        SELECT * FROM chat_logs 
        WHERE client_id = $1 AND session_id = $2 
        ORDER BY timestamp ASC 
        LIMIT $3
      `;
      params = [clientId, sessionId, limit];
    } else {
      // Get all messages for client
      query = `
        SELECT * FROM chat_logs 
        WHERE client_id = $1 
        ORDER BY timestamp DESC 
        LIMIT $2
      `;
      params = [clientId, limit];
    }

    const result = await pool.query(query, params);

    // Transform database results to match existing format
    const chatLogs = result.rows.map((row: any) => ({
      id: row.id,
      clientId: row.client_id,
      sessionId: row.session_id,
      messageType: row.message_type,
      content: row.content,
      userInfo: row.user_info || null,
      timestamp: row.timestamp,
      createdAt: row.created_at
    }));

    console.log(`Retrieved ${chatLogs.length} chat logs for client ${clientId}${sessionId ? `, session ${sessionId}` : ''}`);

    return NextResponse.json({
      success: true,
      client: clientId,
      sessionId: sessionId || 'all',
      count: chatLogs.length,
      data: chatLogs
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

    console.log('Attempting to log chat message:', { 
      clientId, 
      sessionId, 
      messageType, 
      content: content.substring(0, 50) + '...' 
    });

    // Validate required fields
    if (!clientId || !sessionId || !messageType || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: clientId, sessionId, messageType, content' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Insert new chat log entry
    const result = await pool.query(`
      INSERT INTO chat_logs (
        client_id, session_id, message_type, content, user_info
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      clientId,
      sessionId,
      messageType,
      content,
      userInfo ? JSON.stringify(userInfo) : null
    ]);

    const newLogEntry = result.rows[0];

    // Transform to match existing format
    const formattedEntry = {
      id: newLogEntry.id,
      clientId: newLogEntry.client_id,
      sessionId: newLogEntry.session_id,
      messageType: newLogEntry.message_type,
      content: newLogEntry.content,
      userInfo: newLogEntry.user_info,
      timestamp: newLogEntry.timestamp,
      createdAt: newLogEntry.created_at
    };

    console.log('Chat message logged successfully:', {
      id: formattedEntry.id,
      clientId: formattedEntry.clientId,
      sessionId: formattedEntry.sessionId,
      messageType: formattedEntry.messageType
    });

    return NextResponse.json({
      success: true,
      message: 'Chat message logged successfully',
      client: clientId,
      sessionId: sessionId,
      data: formattedEntry
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

    console.log('DELETE chat logs request:', { clientId, sessionId });

    // Validate required parameters
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required for deletion' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if conversation exists
    const existingResult = await pool.query(
      'SELECT COUNT(*) as count FROM chat_logs WHERE client_id = $1 AND session_id = $2',
      [clientId, sessionId]
    );

    const messageCount = parseInt(existingResult.rows[0].count);

    if (messageCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No conversation found with the specified session ID' },
        { status: 404 }
      );
    }

    // Delete all messages with the specified session ID
    const deleteResult = await pool.query(
      'DELETE FROM chat_logs WHERE client_id = $1 AND session_id = $2 RETURNING id',
      [clientId, sessionId]
    );

    const deletedCount = deleteResult.rows.length;

    console.log(`Successfully deleted ${deletedCount} messages for session ${sessionId} from client ${clientId}`);

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