/**
 * Test Tool Registry
 * Quick script to test the tool registry functionality
 */

import { config } from 'dotenv';
import { 
  getTool, 
  executeTool, 
  isToolAvailable, 
  getAllTools,
  getToolSchemas 
} from '../src/lib/tools/registry';

// Load environment variables
config({ path: '.env.local' });

async function testToolRegistry() {
  console.log('🔧 Testing Tool Registry...\n');
  
  // Test 1: Get tool
  console.log('Test 1: Get Tool');
  console.log('Getting web_search tool...');
  const tool = getTool('web_search');
  console.log('Result:', tool ? '✅ Tool found' : '❌ Tool not found');
  console.log('Tool ID:', tool?.id);
  console.log('Tool Name:', tool?.name);
  console.log('Tool Description:', tool?.description);
  console.log('\n---\n');
  
  // Test 2: Execute tool
  console.log('Test 2: Execute Tool');
  console.log('Executing web_search with query "test query"...');
  const result = await executeTool('web_search', {
    query: 'test query',
    maxResults: 5,
  });
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('\n---\n');
  
  // Test 3: Check availability
  console.log('Test 3: Check Tool Availability');
  console.log('Checking web_search availability...');
  const available = isToolAvailable('web_search');
  console.log('Result:', available ? '✅ Available' : '❌ Not available');
  console.log('(Availability depends on TAVILY_API_KEY configuration)');
  console.log('\n---\n');
  
  // Test 4: Invalid tool
  console.log('Test 4: Get Invalid Tool');
  console.log('Trying to get non-existent tool...');
  const invalid = getTool('invalid_tool' as any);
  console.log('Result:', invalid === undefined ? '✅ Correctly returns undefined' : '❌ Should return undefined');
  console.log('\n---\n');
  
  // Test 5: Get all tools
  console.log('Test 5: Get All Tools');
  console.log('Getting all registered tools...');
  const allTools = getAllTools();
  console.log('Result:', `${allTools.length} tool(s) registered`);
  allTools.forEach((t) => {
    console.log(`  - ${t.id}: ${t.name}`);
  });
  console.log('\n---\n');
  
  // Test 6: Get tool schemas for OpenAI
  console.log('Test 6: Get Tool Schemas (OpenAI Function Calling)');
  console.log('Getting schemas for web_search...');
  const schemas = getToolSchemas(['web_search']);
  console.log('Result:', JSON.stringify(schemas, null, 2));
  console.log('\n---\n');
  
  // Test 7: Check other tools availability
  console.log('Test 7: Check All Tools Availability');
  const toolIds = ['web_search', 'email', 'calendar', 'db_ops'] as const;
  toolIds.forEach((toolId) => {
    const isAvail = isToolAvailable(toolId);
    console.log(`  ${toolId}: ${isAvail ? '✅ Available' : '⏳ Not available yet'}`);
  });
  console.log('\n---\n');
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`Test 1 (Get Tool): ${tool ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Test 2 (Execute): ${result.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Test 3 (Availability): ${available ? '✅ PASS' : '⚠️  WARNING - Check API key'}`);
  console.log(`Test 4 (Invalid Tool): ${invalid === undefined ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Test 5 (Get All): ${allTools.length > 0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Test 6 (Schemas): ${schemas.length > 0 ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n✅ Tool Registry tests completed!');
}

testToolRegistry()
  .then(() => {
    console.log('\n🎉 All tests finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  });

