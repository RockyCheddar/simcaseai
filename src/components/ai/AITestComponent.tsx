'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AIResponse } from '@/lib/api/interfaces';
import AIAnalysisDisplay from './AIAnalysisDisplay';

export default function AITestComponent() {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<'claude' | 'perplexity' | 'chatgpt' | 'test'>('claude');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [system, setSystem] = useState("You are a helpful assistant specializing in medical education.");
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setDebugInfo(null);
    
    const callStartTime = new Date().toISOString();
    console.log(`Sending prompt to ${provider} API${testMode ? ' (TEST MODE)' : ''} at ${callStartTime}`);
    toast.loading('Sending request...', { id: 'ai-request' });

    try {
      // Test mode response to avoid API calls during development/testing
      if (testMode) {
        const testResponse: AIResponse = {
          text: `This is a test response to: "${prompt}"\n\nNo actual AI API was called. This is a mock response for testing purposes.`,
          provider: provider,
          timestamp: new Date().toISOString(),
          modelUsed: `${provider}-test-mode`
        };
        
        setResponse(testResponse);
        toast.success(`Received test response`, { id: 'ai-request' });
        setDebugInfo(`Test mode active\nNo API call was made.\nMock response generated at: ${new Date().toISOString()}`);
        setIsLoading(false);
        return;
      }
      
      // Direct API call
      console.log('Making direct API call to Claude endpoint');
      
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.7,
          max_tokens: 4000,
          system
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from API route');
      }
      
      const result: AIResponse = {
        text: data.content[0].text,
        provider: 'claude',
        timestamp: new Date().toISOString(),
        modelUsed: 'claude-3-7-sonnet-20250219'
      };
      
      console.log(`Received response from ${result.provider} at ${new Date().toISOString()}`);
      setResponse(result);
      toast.success(`Received response from Claude`, { id: 'ai-request' });
      setDebugInfo(`Request sent at: ${callStartTime}\nResponse received at: ${new Date().toISOString()}\nProvider: Claude\nModel: claude-3-7-sonnet-20250219`);
    } catch (err: any) {
      console.error('Error testing AI:', err);
      const errorMessage = err.message || 'Failed to get AI response';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'ai-request' });
      setDebugInfo(`Request sent at: ${callStartTime}\nError at: ${new Date().toISOString()}\nError: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderColor = () => {
    switch (provider) {
      case 'claude':
        return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500';
      case 'perplexity':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'chatgpt':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'test':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      default:
        return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test AI Integration</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
            Select AI Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="claude">Claude (3 Sonnet)</option>
            <option value="perplexity">Perplexity (Sonar Deep Research)</option>
            <option value="chatgpt">ChatGPT (Requires API key)</option>
            <option value="test">Test Mode (Instant mock response)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="system" className="block text-sm font-medium text-gray-700 mb-1">
            System Prompt
          </label>
          <input
            type="text"
            id="system"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex items-center mb-4">
          <input
            id="test-mode"
            type="checkbox"
            checked={testMode}
            onChange={() => setTestMode(!testMode)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="test-mode" className="ml-2 block text-sm text-gray-700">
            Test Mode (Skip API call, return mock response immediately)
          </label>
        </div>
        
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Prompt
          </label>
          <textarea
            id="prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt for the AI..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="mb-4 bg-blue-50 p-3 rounded text-sm">
          <p className="text-blue-700">
            <strong>Note:</strong> Using server-side API routes to avoid CORS issues.
            {provider === 'perplexity' && " Perplexity's Sonar Deep Research model runs multiple searches and performs advanced reasoning, which may take longer but provides more thorough results."}
            {provider === 'claude' && " Using Claude 3 Sonnet model for optimal performance."}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${getProviderColor()}`}
        >
          {isLoading ? 'Getting Response...' : `Get ${provider.charAt(0).toUpperCase() + provider.slice(1)} Response`}
        </button>
      </form>
      
      {debugInfo && (
        <div className="mb-4 bg-gray-50 p-3 border border-gray-200 rounded text-xs font-mono whitespace-pre-line">
          <strong>Debug Info:</strong>
          <div>{debugInfo}</div>
        </div>
      )}
      
      <div className="mt-6">
        <AIAnalysisDisplay
          loading={isLoading}
          response={response}
          error={error}
          title="AI Response"
        />
      </div>
    </div>
  );
} 