// Test script for Claude API using the application's implementation
// Run with: node test-claude-app.mjs

import * as dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testClaudeAPI() {
  const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  
  if (!API_KEY) {
    console.error('Claude API key is missing');
    return;
  }
  
  console.log('Testing Claude API using app implementation...');
  try {
    const anthropic = new Anthropic({
      apiKey: API_KEY,
    });
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 100,
      temperature: 0.7,
      system: 'You are a helpful assistant for a medical education application.',
      messages: [
        { role: 'user', content: 'Analyze this learning objective: "Understand the importance of patient history in diagnosing chest pain."' }
      ]
    });
    
    console.log('\nClaude Response:');
    console.log(response.content[0].text);
    console.log('\nClaude SUCCESS ✅');
    
    // Additional test using a more complex prompt
    console.log('\nRunning second test with complex medical prompt...');
    
    const complexResponse = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 300,
      temperature: 0.7,
      system: 'You are a medical education expert specializing in healthcare simulation cases.',
      messages: [
        { role: 'user', content: 'Generate a brief patient profile for a simulation case about acute myocardial infarction. Include demographics, chief complaint, and relevant history.' }
      ]
    });
    
    console.log('\nComplex Medical Response:');
    console.log(complexResponse.content[0].text);
    console.log('\nComplex Medical Test SUCCESS ✅');
    
  } catch (error) {
    console.error('Claude ERROR ❌:', error);
  }
}

// Run the test
console.log('Environment Variables:');
console.log('- NEXT_PUBLIC_ANTHROPIC_API_KEY:', !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY);
testClaudeAPI(); 