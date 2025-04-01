import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '@/utils/logger';

export async function GET(req: Request) {
  try {
    // Get API key from environment variable
    const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    
    // Return information about the API key without exposing it
    const keyInfo = {
      exists: !!API_KEY,
      length: API_KEY ? API_KEY.length : 0,
      prefix: API_KEY ? API_KEY.substring(0, 7) : '',
      isValidFormat: API_KEY ? API_KEY.startsWith('sk-ant-') : false,
      environment: process.env.NODE_ENV
    };
    
    logger.info('Claude API key test', keyInfo);
    
    // Try a simple API call if the key exists
    if (API_KEY) {
      try {
        const anthropic = new Anthropic({
          apiKey: API_KEY,
          timeout: 10000, // Short timeout for test
        });
        
        const message = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 10,
          temperature: 0.7,
          system: 'You are a helpful assistant.',
          messages: [
            { role: 'user', content: 'Say "API test successful" and nothing else.' }
          ]
        });
        
        return NextResponse.json({
          keyInfo,
          testResult: 'success',
          response: message.content[0].text
        });
      } catch (apiError: any) {
        logger.error('Claude API test call failed', apiError);
        
        return NextResponse.json({
          keyInfo,
          testResult: 'api_call_failed',
          error: apiError.message,
          status: apiError.status,
          type: apiError.type,
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      keyInfo,
      testResult: 'no_key'
    }, { status: 400 });
    
  } catch (error: any) {
    logger.error('Claude API key test error', error);
    
    return NextResponse.json({
      error: 'Test endpoint error',
      message: error.message
    }, { status: 500 });
  }
} 