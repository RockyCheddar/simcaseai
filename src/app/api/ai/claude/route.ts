import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Add a constant for timeout duration (in milliseconds)
const API_TIMEOUT = 30000; // 30 seconds

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, temperature, max_tokens, system } = body;
    
    // Get API key from environment variable
    const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key is missing' },
        { status: 500 }
      );
    }
    
    // Initialize the Anthropic client with a timeout option
    const anthropic = new Anthropic({
      apiKey: API_KEY,
      timeout: API_TIMEOUT, // Add timeout to the client
    });
    
    // Use the specific model name provided
    const modelToUse = "claude-3-7-sonnet-20250219";
    
    console.log('Server-side Claude API call with model:', modelToUse);
    
    // Create a timeout promise to race against the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Claude API call timed out after ${API_TIMEOUT}ms`)), API_TIMEOUT);
    });
    
    // Race the API call against the timeout
    const message = await Promise.race([
      anthropic.messages.create({
        model: modelToUse,
        max_tokens: max_tokens || 4000,
        temperature: temperature || 0.7,
        system: system || "You are a medical education expert specializing in healthcare simulation cases.",
        messages: [
          { role: "user", content: prompt }
        ]
      }),
      timeoutPromise
    ]) as Anthropic.Messages.Message;
    
    // Check if content is available and is of type 'text'
    if (!message || !message.content || message.content.length === 0) {
      throw new Error("Invalid or empty response from Claude API");
    }
    
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Response received but no text content available';
    
    // Return the response
    return NextResponse.json({
      content: [{ text: responseText }]
    });
    
  } catch (error: any) {
    console.error('Claude API error:', error.message || error);
    
    // Check for timeout error specifically
    const errorMessage = error.message || String(error);
    const isTimeout = errorMessage.includes('timed out');
    
    return NextResponse.json(
      { 
        error: `Claude API error: ${errorMessage}`,
        isTimeout: isTimeout
      },
      { status: isTimeout ? 504 : 500 } // Use 504 Gateway Timeout for timeouts
    );
  }
} 