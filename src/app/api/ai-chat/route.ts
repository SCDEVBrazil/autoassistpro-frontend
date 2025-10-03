// src/app/api/ai-chat/route.ts
// FIXED VERSION - Improved Knowledge Base Search

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { clientId, query, sessionId, userName, deviceType } = body;

    // Log incoming request for debugging
    console.log('=== AI Chat Request ===');
    console.log('Client ID:', clientId);
    console.log('Query:', query);
    console.log('Session ID:', sessionId);
    console.log('User Name:', userName);
    console.log('Device Type:', deviceType);
    console.log('=====================');

    // Validate required fields
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query cannot be empty' },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Validate Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'AI service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // FIXED: Enhanced Knowledge Base Query
    console.log('\n--- Querying Knowledge Base ---');
    const pool = getPool();
    
    // IMPROVED: Better keyword extraction
    // 1. Remove punctuation
    // 2. Split into words
    // 3. Filter out very short words (but keep length 2+)
    // 4. Remove common stop words
    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, ' ');
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of'];
    const queryWords = cleanQuery
      .split(/\s+/)
      .filter((word: string) => word.length >= 2) // FIXED: Changed from > 3 to >= 2
      .filter((word: string) => !stopWords.includes(word));
    
    console.log('Original query:', query);
    console.log('Cleaned query:', cleanQuery);
    console.log('Search keywords:', queryWords);
    
    // IMPROVED: Better search query
    // Search across category, content, and keywords columns
    // Use ILIKE for case-insensitive partial matching
    const searchPatterns = queryWords.map((word: string) => `%${word}%`);
    
    const knowledgeResult = await pool.query(`
      SELECT id, category, content, keywords
      FROM autoassistpro_knowledge
      WHERE 
        category ILIKE ANY($1)
        OR content ILIKE ANY($1)
        OR keywords ILIKE ANY($1)
      ORDER BY 
        CASE 
          WHEN category ILIKE ANY($1) THEN 1
          WHEN keywords ILIKE ANY($1) THEN 2
          ELSE 3
        END,
        id ASC
      LIMIT 5
    `, [searchPatterns]);

    console.log(`Found ${knowledgeResult.rows.length} relevant knowledge entries`);
    
    if (knowledgeResult.rows.length > 0) {
      console.log('Knowledge entries found:');
      knowledgeResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. Category: ${row.category}`);
        console.log(`     Content preview: ${row.content.substring(0, 80)}...`);
        console.log(`     Keywords: ${row.keywords.substring(0, 80)}...`);
      });
    } else {
      console.log('No specific knowledge found, will use general knowledge');
    }
    console.log('-------------------------------\n');

    // Build context and call Groq API
    console.log('--- Calling Groq AI ---');
    
    // Build knowledge context from retrieved entries
    const knowledgeContext = knowledgeResult.rows.length > 0
      ? knowledgeResult.rows.map((row: any) => row.content).join('\n\n')
      : 'No specific knowledge found. Provide a helpful general response about TechEquity Consulting.';

    // IMPROVED: Better system prompt
    const systemPrompt = `You are an AI assistant for TechEquity Consulting, a professional operations and cybersecurity consulting firm. 

Your role is to:
- Answer questions accurately using the knowledge base provided
- Always use "our team" language, never first-person
- Be professional, helpful, and concise
- When relevant, encourage discovery calls to discuss specific needs
- Focus on the value TechEquity provides to clients

KNOWLEDGE BASE:
${knowledgeContext}

IMPORTANT: Base your response on the knowledge base above. If the information isn't in the knowledge base, politely say so and offer to help with related topics.`;

    const userPrompt = query;

    console.log('System prompt length:', systemPrompt.length);
    console.log('User query:', userPrompt);

    // Call Groq API with error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500, // INCREASED from 500 to match n8n's longer responses
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('Groq API error response:', errorText);
        
        // Handle specific error codes
        if (groqResponse.status === 429) {
          return NextResponse.json(
            { success: false, error: 'AI service is busy. Please try again in a moment.' },
            { status: 429 }
          );
        } else if (groqResponse.status === 401) {
          console.error('Invalid Groq API key');
          return NextResponse.json(
            { success: false, error: 'AI service authentication failed. Please contact support.' },
            { status: 503 }
          );
        } else {
          return NextResponse.json(
            { success: false, error: 'AI service is temporarily unavailable. Please try again.' },
            { status: 503 }
          );
        }
      }

      const groqData = await groqResponse.json();
      const aiResponse = groqData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      console.log('AI Response length:', aiResponse.length);
      console.log('Tokens used:', groqData.usage);
      console.log('------------------------\n');

      return NextResponse.json({
        success: true,
        response: aiResponse,
        metadata: {
          clientId,
          sessionId,
          knowledgeEntriesFound: knowledgeResult.rows.length,
          tokensUsed: groqData.usage,
          timestamp: new Date().toISOString()
        }
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Groq API request timed out');
        return NextResponse.json(
          { success: false, error: 'AI service took too long to respond. Please try again.' },
          { status: 504 }
        );
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('=== Error in AI Chat Route ===');
    console.error('Error type:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('============================\n');

    // Return user-friendly error message
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined
      },
      { status: 500 }
    );
  }
}