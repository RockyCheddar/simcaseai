import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/api/ai-service';
import { AIResponse } from '@/lib/api/interfaces';

export async function GET(req: Request) {
  try {
    const results: {
      testMode: AIResponse | null;
      testModeError: string | null;
      envVars: {
        claudeKey: boolean;
        perplexityKey: boolean;
      };
    } = {
      testMode: null,
      testModeError: null,
      envVars: {
        claudeKey: !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        perplexityKey: !!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY
      }
    };

    // Test with test mode to verify the app works locally
    try {
      console.log('Testing with test mode...');
      const testResponse = await generateAIResponse({
        prompt: 'Test prompt',
        testMode: true,
        provider: 'test'
      });
      console.log('Test mode SUCCESS ✅');
      results.testMode = testResponse;
    } catch (error: any) {
      console.error('Test mode ERROR ❌:', error.message);
      results.testModeError = error.message;
    }

    // Log environment variables (sanitized)
    console.log('Environment Variables Check:');
    console.log('- NEXT_PUBLIC_ANTHROPIC_API_KEY:', process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? 'Set ✅' : 'Not Set ❌');
    console.log('- NEXT_PUBLIC_PERPLEXITY_API_KEY:', process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY ? 'Set ✅' : 'Not Set ❌');
    
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 