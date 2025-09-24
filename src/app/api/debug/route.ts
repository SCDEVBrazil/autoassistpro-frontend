// src/app/api/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const appointmentsFile = path.join(dataDir, 'appointments.json');
    const chatLogsFile = path.join(dataDir, 'chat-logs.json');
    
    const debug = {
      environment: process.env.NODE_ENV || 'unknown',
      dataDirectory: {
        path: dataDir,
        exists: fs.existsSync(dataDir),
        writable: false
      },
      files: {
        appointments: {
          path: appointmentsFile,
          exists: fs.existsSync(appointmentsFile),
          size: fs.existsSync(appointmentsFile) ? fs.statSync(appointmentsFile).size : 0,
          content: null as any
        },
        chatLogs: {
          path: chatLogsFile,
          exists: fs.existsSync(chatLogsFile), 
          size: fs.existsSync(chatLogsFile) ? fs.statSync(chatLogsFile).size : 0,
          content: null as any
        }
      }
    };

    // Test write permissions
    try {
      const testFile = path.join(dataDir, 'test-write.txt');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      debug.dataDirectory.writable = true;
    } catch (error) {
      debug.dataDirectory.writable = false;
    }

    // Read file contents if they exist
    if (debug.files.appointments.exists) {
      try {
        const content = fs.readFileSync(appointmentsFile, 'utf8');
        debug.files.appointments.content = JSON.parse(content);
      } catch (error) {
        debug.files.appointments.content = { error: 'Failed to read' };
      }
    }

    if (debug.files.chatLogs.exists) {
      try {
        const content = fs.readFileSync(chatLogsFile, 'utf8');
        debug.files.chatLogs.content = JSON.parse(content);
      } catch (error) {
        debug.files.chatLogs.content = { error: 'Failed to read' };
      }
    }

    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}