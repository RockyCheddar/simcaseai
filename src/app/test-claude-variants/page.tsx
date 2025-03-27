'use client';

import { useState } from 'react';
import { callClaude } from '@/lib/api/providers/claude';

export default function TestClaudeVariantsPage() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const testClaude = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await callClaude({
        prompt: "Please respond with a simple 'Hello from Claude!' to confirm the API is working."
        // Using the default model (claude-3-7-sonnet-20250219)
      });
      
      setResponse(result.text);
    } catch (err: any) {
      console.error('Error testing Claude API:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Test Claude API with Standard Model</h1>
      
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4 text-gray-700">
          The Claude API is now configured to use model <code className="bg-gray-100 px-1 py-0.5 rounded">claude-3-7-sonnet-20250219</code> 
          as specified.
        </p>
        
        <button 
          onClick={testClaude}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md mb-4"
        >
          {loading ? 'Testing Claude API...' : 'Test Claude API'}
        </button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {response && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Response:</h3>
            <p className="text-sm">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
} 