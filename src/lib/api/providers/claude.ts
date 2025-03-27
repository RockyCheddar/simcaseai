import { AIResponse } from '@/lib/api/ai-service';

// Default model to use - using the specified model name
const DEFAULT_MODEL = 'claude-3-7-sonnet-20250219';
const TIMEOUT_MS = 20000; // 20 second timeout

export interface ClaudeOptions {
  prompt: string;
  model?: string; // We'll keep this for backwards compatibility
  temperature?: number;
  max_tokens?: number;
  system?: string;
}

/**
 * Calls the Claude API with the provided options
 */
export async function callClaude(options: ClaudeOptions): Promise<AIResponse> {
  const {
    prompt,
    model = DEFAULT_MODEL, // This is kept for backwards compatibility
    temperature = 0.7,
    max_tokens = 4000,
    system = "You are a medical education expert specializing in healthcare simulation cases."
  } = options;

  const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!API_KEY) {
    throw new Error('Claude API key is missing');
  }

  // Validate API key format
  if (!API_KEY.startsWith('sk-ant-')) {
    console.error('Invalid Claude API key format. Should start with sk-ant-');
  }

  console.log("Calling Claude API with model:", DEFAULT_MODEL);
  
  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

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
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Claude API error: ${errorData.error || response.statusText}`);
      } catch (e) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }
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
      console.error('Claude API request timed out after', TIMEOUT_MS/1000, 'seconds');
      throw new Error(`Claude API request timed out after ${TIMEOUT_MS/1000} seconds`);
    }
    
    console.error('Error calling Claude API:', error);
    throw error;
  }
} 