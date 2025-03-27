import { AIResponse } from '@/lib/api/ai-service';

// Default model to use
const DEFAULT_MODEL = 'sonar-deep-research';
const TIMEOUT_MS = 20000; // 20 second timeout for deep research

export interface PerplexityOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
}

/**
 * Calls the Perplexity API with the provided options
 */
export async function callPerplexity(options: PerplexityOptions): Promise<AIResponse> {
  const {
    prompt,
    model = DEFAULT_MODEL,
    temperature = 0.7,
    max_tokens = 4000,
    system = "You are a medical education expert specializing in healthcare simulation cases. Provide comprehensive, well-researched answers with citations where appropriate."
  } = options;

  const API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
  if (!API_KEY) {
    throw new Error('Perplexity API key is missing');
  }

  console.log("Calling Perplexity API with model:", model);
  
  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Use the server-side API route instead of calling Perplexity directly
    // This avoids CORS issues as the request comes from the same origin
    const response = await fetch('/api/ai/perplexity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
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
      console.error("Perplexity API error response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Perplexity API error: ${errorData.error || response.statusText}`);
      } catch (e) {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log("Perplexity API response received");
    
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response format from Perplexity API');
    }
    
    return {
      text: data.choices[0].message.content,
      provider: 'perplexity',
      timestamp: new Date().toISOString(),
      modelUsed: model
    };
  } catch (error: any) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('Perplexity API request timed out after', TIMEOUT_MS/1000, 'seconds');
      throw new Error(`Perplexity API request timed out after ${TIMEOUT_MS/1000} seconds`);
    }
    
    console.error('Error calling Perplexity API:', error);
    throw error;
  }
} 