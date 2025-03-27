import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, model, temperature, max_tokens, system } = body;
    
    // Get API key from environment variable
    const API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Perplexity API key is missing' },
        { status: 500 }
      );
    }
    
    console.log('Server-side Perplexity API call with model:', model);
    
    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: model || 'sonar-deep-research',
        messages: [
          {
            role: 'system',
            content: system || "You are a medical education expert specializing in healthcare simulation cases."
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: max_tokens || 4000,
        temperature: temperature || 0.7
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      
      return NextResponse.json(
        { error: `Perplexity API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Perplexity API success');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Perplexity API route:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 