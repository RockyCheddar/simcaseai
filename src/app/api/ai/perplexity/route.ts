import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

// Add a constant for timeout duration (in milliseconds)
const API_TIMEOUT = 30000; // 30 seconds

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, temperature, max_tokens, system } = body;

    // Get API key from environment variable
    const API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
    if (!API_KEY) {
      const error = new Error('Perplexity API key is missing');
      logger.error('Perplexity API key missing', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    logger.info('Server-side Perplexity API call initiated', {
      maxTokens: max_tokens,
      temperature
    });

    // Create a timeout promise to race against the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Perplexity API call timed out after ${API_TIMEOUT}ms`)), API_TIMEOUT);
    });

    // Set up the API call options
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "pplx-70b-online",
        messages: [
          {
            role: "system",
            content: system || "You are a medical education expert specializing in healthcare simulation cases."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: max_tokens || 4000,
        temperature: temperature || 0.7,
      })
    };

    // Race the API call against the timeout
    const response = await Promise.race([
      fetch('https://api.perplexity.ai/chat/completions', options),
      timeoutPromise
    ]) as Response;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Perplexity API responded with status ${response.status}: ${response.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid or empty response from Perplexity API');
    }

    const responseText = data.choices[0].message.content;

    logger.info('Perplexity API call successful', {
      contentLength: responseText.length,
      messageId: data.id
    });

    return NextResponse.json({
      content: [{ text: responseText }]
    });

  } catch (error: any) {
    // Check for specific error types
    const isTimeout = error.message?.includes('timed out') || error.name === 'AbortError';
    const isRateLimit = error.status === 429;
    const isServerError = error.status >= 500;
    
    // Log the error with context
    logger.error('Perplexity API error', error, {
      isTimeout,
      isRateLimit,
      isServerError,
      status: error.status,
      name: error.name
    });
    
    // Return appropriate error response
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while calling Perplexity API',
        isTimeout,
        isRateLimit,
        isServerError
      },
      { 
        status: isTimeout ? 504 : 
                isRateLimit ? 429 :
                isServerError ? 502 :
                500
      }
    );
  }
} 