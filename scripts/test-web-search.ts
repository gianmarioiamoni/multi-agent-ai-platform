/**
 * Test Web Search Tool
 * Quick script to test the web search tool functionality
 */

/* eslint-disable no-console */
import { config } from 'dotenv';
import { webSearchTool } from '../src/lib/tools/web-search';

// Load environment variables
config({ path: '.env.local' });

async function testWebSearch() {
  console.log('🔍 Testing Web Search Tool...\n');
  
  // Test 1: Basic search
  console.log('Test 1: Basic Search');
  console.log('Query: "Latest AI developments"');
  const result1 = await webSearchTool.execute({
    query: 'Latest AI developments',
    maxResults: 3,
  });
  console.log('Result:', JSON.stringify(result1, null, 2));
  console.log('\n---\n');
  
  // Test 2: Empty query (should fail)
  console.log('Test 2: Empty Query (should fail)');
  console.log('Query: ""');
  const result2 = await webSearchTool.execute({
    query: '',
  });
  console.log('Result:', JSON.stringify(result2, null, 2));
  console.log('\n---\n');
  
  // Test 3: Many results
  console.log('Test 3: Many Results');
  console.log('Query: "OpenAI GPT-4"');
  const result3 = await webSearchTool.execute({
    query: 'OpenAI GPT-4',
    maxResults: 10,
  });
  console.log('Result:', JSON.stringify(result3, null, 2));
  console.log('\n---\n');
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`Test 1: ${result1.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Test 2: ${!result2.success ? '✅ PASS (expected to fail)' : '❌ FAIL (should have failed)'}`);
  console.log(`Test 3: ${result3.success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (result1.success) {
    console.log(`\n✅ Web Search Tool is working!`);
    console.log(`   Execution time: ${result1.executionTime}ms`);
  } else {
    console.log(`\n❌ Web Search Tool failed. Check your TAVILY_API_KEY.`);
  }
}

testWebSearch()
  .then(() => {
    console.log('\n✅ Tests completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  });

