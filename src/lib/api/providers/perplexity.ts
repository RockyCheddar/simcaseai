import { AIResponse, PerplexityOptions } from '@/lib/api/interfaces';

// Default model to use
const DEFAULT_MODEL = 'sonar-deep-research';
const TIMEOUT_MS = 20000; // 20 second timeout for deep research

// Detect if we're running on the server or on the client
const isServer = typeof window === 'undefined';

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
  console.log('Environment:', isServer ? 'Server' : 'Client');
  
  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let responseData;
    
    // Check if we're in a server environment
    if (isServer) {
      console.log('Using direct API call to Perplexity (server-side)');
      
      try {
        // Server-side: Call Perplexity API directly
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
                content: system
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: max_tokens,
            temperature: temperature,
          }),
          signal: controller.signal
        };
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', options);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Perplexity API responded with status ${response.status}: ${response.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
        }
        
        const apiResponse = await response.json();
        
        // Use a consistent response format
        responseData = {
          choices: apiResponse.choices
        };
      } catch (error) {
        console.error('Error making direct API call to Perplexity:', error);
        throw error;
      }
    } else {
      console.log('Using API route for Perplexity (client-side)');
      
      // Client-side: Use the API route
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

      responseData = await response.json();
    }

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);
    
    console.log("Perplexity API response received");
    
    if (!responseData.choices || responseData.choices.length === 0 || !responseData.choices[0].message || !responseData.choices[0].message.content) {
      throw new Error('Invalid response format from Perplexity API');
    }
    
    return {
      text: responseData.choices[0].message.content,
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