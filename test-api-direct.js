// Direct API test script for Claude and Perplexity
// Run with: node test-api-direct.js

require('dotenv').config({ path: '.env.local' });
const { Anthropic } = require('@anthropic-ai/sdk');
const fetch = require('node-fetch');

async function testClaudeAPI() {
  const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  
  if (!API_KEY) {
    console.error('Claude API key is missing');
    return;
  }
  
  console.log('Testing Claude API...');
  try {
    const anthropic = new Anthropic({
      apiKey: API_KEY,
    });
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 100,
      temperature: 0.7,
      system: 'You are a helpful assistant.',
      messages: [
        { role: 'user', content: 'Write a brief hello world message' }
      ]
    });
    
    console.log('Claude Response:');
    console.log(response.content[0].text);
    console.log('Claude SUCCESS ✅');
  } catch (error) {
    console.error('Claude ERROR ❌:', error.message);
  }
}

async function testPerplexityAPI() {
  const API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
  
  if (!API_KEY) {
    console.error('Perplexity API key is missing');
    return;
  }
  
  console.log('\nTesting Perplexity API...');
  
  try {
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'pplx-70b-online',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Write a brief hello world message'
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      })
    };
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Perplexity API responded with status ${response.status}: ${response.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
    }
    
    const data = await response.json();
    
    console.log('Perplexity Response:');
    console.log(data.choices[0].message.content);
    console.log('Perplexity SUCCESS ✅');
  } catch (error) {
    console.error('Perplexity ERROR ❌:', error.message);
  }
}

async function run() {
  console.log('Environment Variables:');
  console.log('- NEXT_PUBLIC_ANTHROPIC_API_KEY:', !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY);
  console.log('- NEXT_PUBLIC_PERPLEXITY_API_KEY:', !!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY);
  
  await testClaudeAPI();
  await testPerplexityAPI();
}

run(); 