#!/usr/bin/env node

/**
 * Quick test script for your deployed Component Builder API
 * Usage: node quick-test.js [your-railway-url]
 */

const ComponentBuilderClient = require('./universal-client.js');

async function main() {
  // Get URL from command line argument or use default
  const baseURL = process.argv[2] || 'https://your-app-name.railway.app';
  
  console.log('🚂 Component Builder Quick Test');
  console.log('================================');
  console.log(`📍 Testing: ${baseURL}`);
  console.log('');

  try {
    const client = new ComponentBuilderClient(baseURL);
    
    // Run comprehensive test
    const success = await ComponentBuilderClient.cli.test(baseURL);
    
    if (success) {
      console.log('');
      console.log('🎯 Setup Instructions:');
      console.log('1. Copy universal-client.js to your project');
      console.log('2. Update the baseURL with your Railway URL');
      console.log('3. Use the client in your application');
      console.log('');
      console.log('📖 See USAGE_GUIDE.md for detailed examples');
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if your Railway app is running');
    console.log('2. Verify the URL is correct');
    console.log('3. Ensure the health endpoint responds');
    process.exit(1);
  }
}

// Show usage if no arguments provided
if (process.argv.length < 3) {
  console.log('');
  console.log('📝 Usage: node quick-test.js <your-railway-url>');
  console.log('');
  console.log('Example:');
  console.log('  node quick-test.js https://component-builder-production.railway.app');
  console.log('');
}

main().catch(console.error);