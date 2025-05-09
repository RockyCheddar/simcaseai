import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '@/utils/logger';

// Add a constant for timeout duration (in milliseconds)
const API_TIMEOUT = 120000; // 120 seconds (increased from 30s to account for slower response on render.com)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, temperature, max_tokens, system } = body;
    
    // Get API key from environment variable
    const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!API_KEY) {
      const error = new Error('Claude API key is missing');
      logger.error('Claude API key missing', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    logger.info('Server-side Claude API call initiated', {
      apiKeyLength: API_KEY.length,
      apiKeyPrefix: API_KEY.substring(0, 8),
      model: "claude-3-7-sonnet-20250219",
      maxTokens: max_tokens,
      temperature
    });
    
    // Initialize the Anthropic client with a timeout option
    const anthropic = new Anthropic({
      apiKey: API_KEY,
      timeout: API_TIMEOUT,
    });
    
    // Use the specific model name provided
    const modelToUse = "claude-3-7-sonnet-20250219";
    
    try {
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
      
      logger.info('Claude API call successful', {
        contentLength: responseText.length,
        messageId: message.id
      });
      
      // Return the response
      return NextResponse.json({
        content: [{ text: responseText }]
      });
    } catch (callError: any) {
      // Log details about the specific API call error
      logger.error('Claude API call error', callError, {
        errorType: typeof callError,
        errorName: callError.name,
        errorStatus: callError.status,
        hasResponse: !!callError.response
      });
      
      throw callError; // Re-throw for general error handling
    }
  } catch (error: any) {
    // Check for specific error types
    const isTimeout = error.message?.includes('timed out') || error.name === 'AbortError';
    const isRateLimit = error.status === 429;
    const isServerError = error.status >= 500;
    const isAuthError = error.status === 401 || error.status === 403;
    
    // Log the error with context
    logger.error('Claude API error', error, {
      isTimeout,
      isRateLimit,
      isServerError,
      isAuthError,
      status: error.status,
      name: error.name,
      message: error.message
    });
    
    // Return appropriate error response with more details
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while calling Claude API',
        isTimeout,
        isRateLimit,
        isServerError,
        isAuthError,
        errorName: error.name,
        errorDetails: error.response ? JSON.stringify(error.response) : undefined
      },
      { 
        status: isTimeout ? 504 : 
                isRateLimit ? 429 :
                isAuthError ? 401 :
                isServerError ? 502 :
                500
      }
    );
  }
} 