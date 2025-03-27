'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function LocalTestPage() {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<'claude' | 'perplexity'>('claude');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Local mock response - no API call
      const mockResponse = provider === 'perplexity' 
        ? `This is a local mock response to: "${prompt}"\n\nGenerated for the Perplexity Sonar Deep Research model. No actual API call was made.\n\nIn a real implementation, Sonar Deep Research would run multiple searches and provide comprehensive answers.`
        : `This is a local mock response to: "${prompt}"\n\nGenerated for the Claude provider. No actual API call was made.`;
      
      setResponse(mockResponse);
      toast.success('Response generated locally');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
      toast.error('Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Local API Test (No External API Calls)</h1>
      
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
              Select Mock Provider
            </label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="claude">Claude (Anthropic)</option>
              <option value="perplexity">Perplexity (Sonar Deep Research)</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="mb-4 bg-blue-50 p-3 rounded text-sm">
            <p className="text-blue-700">
              <strong>Note:</strong> This is a local test that doesn't make actual API calls. 
              {provider === 'perplexity' && " In a real implementation, Sonar Deep Research would run multiple searches and provide comprehensive answers."}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              provider === 'claude' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Generating...' : `Generate Local ${provider === 'claude' ? 'Claude' : 'Perplexity'} Response`}
          </button>
        </form>
        
        {isLoading && (
          <div className="border rounded-md p-4 w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-sm text-gray-500">Generating response...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="border border-red-200 rounded-md p-4 w-full mx-auto bg-red-50">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {response && !isLoading && (
          <div className="border rounded-md p-4 w-full mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mock Response</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700">{response}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                provider === 'claude' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {provider === 'claude' ? 'Claude Mock' : 'Perplexity Mock'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 