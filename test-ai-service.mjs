// Test script for application's AI service integration
// Run with: node --experimental-specifier-resolution=node test-ai-service.mjs

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// For ESM imports to work with local files
global.fetch = fetch;
process.env.NODE_ENV = 'development';

// Mock the window object for isServer check
global.window = undefined; // Makes isServer = true

// To enable us to import from the src directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We'll need to manually set up the environment before importing the AI service
console.log('Setting up test environment...');
console.log('API Keys:');
console.log('- NEXT_PUBLIC_ANTHROPIC_API_KEY:', !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY);
console.log('- NEXT_PUBLIC_PERPLEXITY_API_KEY:', !!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY);

async function runTest() {
  try {
    console.log('\nImporting AI service...');
    
    // Dynamic import to ensure the environment is set up first
    const { generateAIResponse } = await import('./src/lib/api/ai-service.js');
    
    if (!generateAIResponse) {
      throw new Error('Failed to import generateAIResponse from AI service');
    }
    
    console.log('AI service imported successfully');
    console.log('\nTesting AI service with Claude provider...');
    
    // Call the AI service with a medical education prompt
    const response = await generateAIResponse({
      prompt: 'Explain how to recognize signs of sepsis in a simulation scenario.',
      provider: 'claude',
      temperature: 0.7,
      maxTokens: 200,
      system: 'You are a medical education expert. Provide concise, accurate information.',
      testMode: false // Set to true to avoid actual API calls and get mock responses
    });
    
    // Display the response
    console.log('\nAI Service Response:');
    console.log(`Provider: ${response.provider}`);
    console.log(`Model: ${response.modelUsed}`);
    console.log(`Timestamp: ${response.timestamp}`);
    console.log('\nContent:');
    console.log(response.text);
    console.log('\nAI Service SUCCESS ✅');
    
  } catch (error) {
    console.error('\nAI Service ERROR ❌:', error);
    console.error('\nNote: This test directly imports your application code and may require some adjustments.');
    console.error('You might need to run this with broader ESM support flags:');
    console.error('node --experimental-modules --es-module-specifier-resolution=node test-ai-service.mjs');
  }
}

// Run the test
runTest(); 