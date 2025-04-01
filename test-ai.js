// Simple test script to check API connectivity for AI providers
import { generateAIResponse } from './src/lib/api/ai-service';

async function testAIProviders() {
  console.log('Testing Claude API...');
  try {
    const claudeResponse = await generateAIResponse({
      prompt: 'Write a brief hello world message',
      provider: 'claude',
      maxTokens: 100
    });
    console.log('Claude Response:', claudeResponse);
    console.log('Claude SUCCESS ✅');
  } catch (error) {
    console.error('Claude ERROR ❌:', error.message);
  }

  console.log('\nTesting Perplexity API...');
  try {
    const perplexityResponse = await generateAIResponse({
      prompt: 'Write a brief hello world message',
      provider: 'perplexity',
      maxTokens: 100
    });
    console.log('Perplexity Response:', perplexityResponse);
    console.log('Perplexity SUCCESS ✅');
  } catch (error) {
    console.error('Perplexity ERROR ❌:', error.message);
  }
}

testAIProviders(); 