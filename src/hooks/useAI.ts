import { useState } from 'react';
import { AIOptions, AIResponse } from '@/lib/api/interfaces';

/**
 * Hook for making AI calls from client components
 */
export function useAI() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);

  /**
   * Generate an AI response using the API routes
   */
  const generateResponse = async (prompt: string, options?: Partial<AIOptions>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 4000,
          system: options?.system || "You are a medical education expert specializing in healthcare simulation cases."
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from API');
      }
      
      const aiResponse: AIResponse = {
        text: data.content[0].text,
        provider: 'claude',
        timestamp: new Date().toISOString(),
        modelUsed: 'claude-3-7-sonnet-20250219'
      };
      
      setResponse(aiResponse);
      return aiResponse;
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error,
    response,
  };
}

export default useAI; 