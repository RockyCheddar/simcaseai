'use client';

import { useState } from 'react';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPIs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred');
      console.error('Error testing APIs:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>
      
      <button
        onClick={testAPIs}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mb-8"
      >
        {loading ? 'Testing APIs...' : 'Test API Connectivity'}
      </button>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}
      
      {results && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          {/* Environment Variables */}
          <div className="border rounded p-4">
            <h3 className="text-lg font-medium mb-4">Environment Variables</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={results.envVars.claudeKey ? "bg-green-100 p-3 rounded" : "bg-red-100 p-3 rounded"}>
                <p className="font-medium">Claude API Key</p>
                <p className="text-sm">{results.envVars.claudeKey ? "✅ Set" : "❌ Not Set"}</p>
              </div>
              <div className={results.envVars.perplexityKey ? "bg-green-100 p-3 rounded" : "bg-red-100 p-3 rounded"}>
                <p className="font-medium">Perplexity API Key</p>
                <p className="text-sm">{results.envVars.perplexityKey ? "✅ Set" : "❌ Not Set"}</p>
              </div>
            </div>
          </div>
          
          {/* Test Mode Results */}
          <div className="border rounded p-4">
            <h3 className="text-lg font-medium mb-2">Test Mode</h3>
            {results.testMode ? (
              <div className="bg-green-100 p-3 rounded">
                <p className="font-medium text-green-700">Success ✅</p>
                <p className="mt-2 text-sm">Response: {results.testMode.text}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Model: {results.testMode.modelUsed}, Timestamp: {results.testMode.timestamp}
                </p>
              </div>
            ) : (
              <div className="bg-red-100 p-3 rounded">
                <p className="font-medium text-red-700">Failed ❌</p>
                <p className="mt-1 text-sm">Error: {results.testModeError}</p>
              </div>
            )}
          </div>
          
          <div className="border rounded p-4 bg-yellow-50">
            <h3 className="text-lg font-medium mb-2">Next Steps</h3>
            <p>To test the actual AI APIs:</p>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>Verify both API keys are properly set in the environment variables</li>
              <li>Launch your production build with <code className="bg-gray-100 px-2 py-1 rounded">npm run build && npm run start</code></li>
              <li>Or update the API provider files to use your own API keys directly for testing</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
} 