'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AIResponse } from '@/lib/api/interfaces';

interface AIAnalysisDisplayProps {
  loading: boolean;
  response: AIResponse | null;
  error: string | null;
  title: string;
}

export default function AIAnalysisDisplay({
  loading,
  response,
  error,
  title
}: AIAnalysisDisplayProps) {
  const [providerColor, setProviderColor] = useState('bg-primary-100 text-primary-800');

  useEffect(() => {
    if (response) {
      switch (response.provider) {
        case 'claude':
          setProviderColor('bg-purple-100 text-purple-800');
          break;
        case 'chatgpt':
          setProviderColor('bg-green-100 text-green-800');
          break;
        case 'perplexity':
          setProviderColor('bg-blue-100 text-blue-800');
          break;
        default:
          setProviderColor('bg-primary-100 text-primary-800');
      }
    }
  }, [response]);

  if (loading) {
    return (
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
          <span className="ml-2 text-sm text-gray-500">AI is analyzing...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-md p-4 w-full mx-auto bg-red-50">
        <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
        <p className="text-red-700">{error}</p>
        <p className="text-sm text-red-600 mt-2">
          Try again or consider simplifying your request.
        </p>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="border rounded-md p-4 w-full mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <div className="prose max-w-none">
        <div className="whitespace-pre-line text-gray-700">{response.text}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${providerColor}`}>
          {response.provider.charAt(0).toUpperCase() + response.provider.slice(1)}
          {response.modelUsed && ` • ${response.modelUsed.split('-')[0]}`}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(response.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
} 