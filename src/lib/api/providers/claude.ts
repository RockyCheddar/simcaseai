import { AIResponse, ClaudeOptions } from '@/lib/api/interfaces';
import Anthropic from '@anthropic-ai/sdk';

// Default model to use - using the specified model name
const DEFAULT_MODEL = 'claude-3-7-sonnet-20250219';
const TIMEOUT_MS = 30000; // Increasing to 30 seconds timeout
const MAX_RETRIES = 2; // Add retry capability for transient errors

// Detect if we're running on the server or on the client
const isServer = typeof window === 'undefined';

/**
 * Calls the Claude API with the provided options
 */
export async function callClaude(options: ClaudeOptions): Promise<AIResponse> {
  const {
    prompt,
    model = DEFAULT_MODEL, // This is kept for backwards compatibility
    temperature = 0.7,
    max_tokens = 4000,
    system = "You are a medical education expert specializing in healthcare simulation cases.",
    retryCount = 0, // Initial retry count is 0
    timeout = TIMEOUT_MS
  } = options;

  const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!API_KEY) {
    throw new Error('Claude API key is missing');
  }

  // Validate API key format
  if (!API_KEY.startsWith('sk-ant-')) {
    console.error('Invalid Claude API key format. Should start with sk-ant-');
  }

  console.log(`Calling Claude API with model: ${DEFAULT_MODEL}${retryCount > 0 ? ` (retry ${retryCount}/${MAX_RETRIES})` : ''}`);
  console.log('Environment:', isServer ? 'Server' : 'Client');
  
  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let responseData;
    
    // Check if we're in a server environment
    if (isServer) {
      console.log('Using direct API call to Anthropic (server-side)');
      
      try {
        // Server-side: Call Anthropic API directly
        const anthropic = new Anthropic({
          apiKey: API_KEY,
        });
        
        const message = await anthropic.messages.create({
          model: DEFAULT_MODEL,
          max_tokens: max_tokens,
          temperature: temperature,
          system: system,
          messages: [
            { role: "user", content: prompt }
          ]
        });
        
        // Use a consistent response format
        responseData = {
          content: [{ text: message.content[0].text }]
        };
      } catch (error) {
        console.error('Error making direct API call to Anthropic:', error);
        throw error;
      }
    } else {
      console.log('Using API route for Claude (client-side)');
      
      // Client-side: Use the API route
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature,
          max_tokens,
          system
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Claude API error response:", errorText);
        console.error("Claude API error status:", response.status, response.statusText);
        
        // Parse the error response
        let errorMessage: string;
        let isTimeout = false;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || response.statusText;
          isTimeout = errorData.isTimeout === true;
          
          // Check explicitly for authentication issues
          const isAuthError = errorData.isAuthError === true || 
                             response.status === 401 || 
                             response.status === 403 ||
                             errorMessage.includes('invalid') && errorMessage.includes('key');
                             
          if (isAuthError) {
            console.error("⚠️ Authentication error detected with Claude API. Please check your API key.");
            errorMessage = "Authentication error with Claude API. Please check your API key is valid and correctly configured.";
          }
          
          // Log more details about the error
          console.error("Claude API error details:", JSON.stringify(errorData, null, 2));
        } catch (e) {
          errorMessage = `${response.status} ${response.statusText}`;
          isTimeout = response.status === 504;
          console.error("Failed to parse error response:", e);
        }
        
        // Check if we should retry
        if ((isTimeout || response.status >= 500) && retryCount < MAX_RETRIES) {
          console.log(`Retrying Claude API call (${retryCount + 1}/${MAX_RETRIES})...`);
          // Exponential backoff delay
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry with incremented retry count
          return callClaude({
            ...options,
            retryCount: retryCount + 1
          });
        }
        
        throw new Error(`Claude API error: ${errorMessage}`);
      }

      responseData = await response.json();
    }

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);
    
    console.log("Claude API response received");
    
    if (!responseData.content || !responseData.content[0] || !responseData.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    return {
      text: responseData.content[0].text,
      provider: 'claude',
      timestamp: new Date().toISOString(),
      modelUsed: DEFAULT_MODEL // Always use the standardized model name
    };
  } catch (error: any) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('Claude API request timed out after', timeout/1000, 'seconds');
      
      // Check if we should retry
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying Claude API call after timeout (${retryCount + 1}/${MAX_RETRIES})...`);
        // Exponential backoff delay
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry with incremented retry count
        return callClaude({
          ...options,
          retryCount: retryCount + 1
        });
      }
      
      throw new Error(`Claude API request timed out after ${timeout/1000} seconds. Please try again later.`);
    }
    
    console.error('Error calling Claude API:', error);
    throw error;
  }
} 