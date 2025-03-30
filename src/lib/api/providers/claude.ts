import { AIResponse, ClaudeOptions } from '@/lib/api/interfaces';

// Default model to use - using the specified model name
const DEFAULT_MODEL = 'claude-3-7-sonnet-20250219';
const TIMEOUT_MS = 30000; // Increasing to 30 seconds timeout
const MAX_RETRIES = 2; // Add retry capability for transient errors

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

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    throw new Error('Claude API key is missing');
  }

  // Validate API key format
  if (!API_KEY.startsWith('sk-ant-')) {
    console.error('Invalid Claude API key format. Should start with sk-ant-');
  }

  console.log(`Calling Claude API with model: ${DEFAULT_MODEL}${retryCount > 0 ? ` (retry ${retryCount}/${MAX_RETRIES})` : ''}`);
  
  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Use the server-side API route instead of calling Anthropic directly
    // This avoids CORS issues as the request comes from the same origin
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

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error response:", errorText);
      
      // Parse the error response
      let errorMessage: string;
      let isTimeout = false;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || response.statusText;
        isTimeout = errorData.isTimeout === true;
      } catch (e) {
        errorMessage = `${response.status} ${response.statusText}`;
        isTimeout = response.status === 504;
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

    const data = await response.json();
    console.log("Claude API response received");
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    return {
      text: data.content[0].text,
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