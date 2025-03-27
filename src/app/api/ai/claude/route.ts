import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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
    
    // Initialize the Anthropic client
    const anthropic = new Anthropic({
      apiKey: API_KEY,
    });
    
    // Use the specific model name provided
    const modelToUse = "claude-3-7-sonnet-20250219";
    
    console.log('Server-side Claude API call with model:', modelToUse);
    
    // Call Claude API with the correct SDK approach
    const message = await anthropic.messages.create({
      model: modelToUse,
      max_tokens: max_tokens || 4000,
      temperature: temperature || 0.7,
      system: system || "You are a medical education expert specializing in healthcare simulation cases.",
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    // Check if content is available and is of type 'text'
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Response received but no text content available';
    
    // Return the response
    return NextResponse.json({
      content: [{ text: responseText }]
    });
    
  } catch (error: any) {
    console.error('Claude API error:', error.message || error);
    
    return NextResponse.json(
      { error: `Claude API error: ${error.message || error}` },
      { status: 500 }
    );
  }
} 