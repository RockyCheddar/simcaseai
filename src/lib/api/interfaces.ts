/**
 * Common interfaces for AI service providers
 */

export type AIProvider = 'claude' | 'chatgpt' | 'perplexity' | 'test';

export interface AIResponse {
  text: string;
  provider: AIProvider;
  timestamp: string;
  modelUsed?: string;
}

export interface BaseProviderOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
  timeout?: number;
}

export interface ClaudeOptions extends BaseProviderOptions {
  retryCount?: number;
}

export interface ChatGPTOptions extends BaseProviderOptions {
  // ChatGPT specific options can be added here
}

export interface PerplexityOptions extends BaseProviderOptions {
  // Perplexity specific options can be added here
}

export interface AIOptions {
  prompt: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  system?: string;
  testMode?: boolean;
  retryCount?: number;
  timeout?: number;
  totalAttempts?: number;
} 