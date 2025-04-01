// Test script for Claude API using the application's API route
// Run with: node test-claude-api-route.mjs

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testClaudeAPIRoute() {
  console.log('Testing Claude API through application API route...');
  
  try {
    // First, start the server in a different terminal with:
    // npm run dev
    // Then run this test script
    
    const response = await fetch('http://localhost:3000/api/ai/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'What are the key symptoms of acute myocardial infarction?',
        temperature: 0.7,
        max_tokens: 200,
        system: 'You are a medical education expert specializing in healthcare simulation cases.'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API route error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from API route');
    }
    
    console.log('\nClaude API Route Response:');
    console.log(data.content[0].text);
    console.log('\nClaude API Route SUCCESS ✅');
    
  } catch (error) {
    console.error('Claude API Route ERROR ❌:', error);
    console.log('\nNote: Make sure the Next.js development server is running with "npm run dev" before running this test.');
  }
}

// Run the test
console.log('This test requires the Next.js development server to be running.');
console.log('Please start the server with "npm run dev" in a separate terminal window before proceeding.');
console.log('Press Ctrl+C to cancel if the server is not running yet.');

// Wait 5 seconds for user to cancel if needed
setTimeout(() => {
  testClaudeAPIRoute();
}, 5000); 