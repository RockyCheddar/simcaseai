import { AIResponse } from '@/lib/api/ai-service';

// Default model to use
const DEFAULT_MODEL = 'gpt-4-turbo';

export interface ChatGPTOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
}

/**
 * Calls the OpenAI API with the provided options
 */
export async function callChatGPT(options: ChatGPTOptions): Promise<AIResponse> {
  const {
    prompt,
    model = DEFAULT_MODEL,
    temperature = 0.7,
    max_tokens = 4000,
    system = "You are a medical education expert specializing in healthcare simulation cases."
  } = options;

  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!API_KEY) {
    throw new Error('OpenAI API key is missing');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: system
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens,
        temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      text: data.choices[0].message.content,
      provider: 'chatgpt',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
} 