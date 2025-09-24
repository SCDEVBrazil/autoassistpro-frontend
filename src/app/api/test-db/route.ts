// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { testConnection, initializeTables } from '@/lib/database';

export async function GET() {
  try {
    // Debug environment variables
    const dbUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL exists:', !!dbUrl);
    console.log('DATABASE_URL starts with postgresql:', dbUrl?.startsWith('postgresql://'));
    
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL environment variable not found'
      }, { status: 500 });
    }
    
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed - check console for details'
      }, { status: 500 });
    }
    
    console.log('Creating database tables...');
    await initializeTables();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful and tables created!'
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}