// Railway deployment test script
import fetch from 'node-fetch';

const RAILWAY_URL = process.env.RAILWAY_URL || "https://your-app.railway.app";

async function testRailwayDeployment() {
    console.log('🚂 Testing Railway Deployment...\n');
    console.log(`Testing URL: ${RAILWAY_URL}\n`);

    // Test 1: Root endpoint (API documentation)
    try {
        console.log('📋 Testing root endpoint...');
        const response = await fetch(`${RAILWAY_URL}/`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Root endpoint working!');
            console.log(`   API Name: ${data.name}`);
            console.log(`   Version: ${data.version}`);
        } else {
            console.log('❌ Root endpoint failed:', data);
        }
    } catch (error) {
        console.log('❌ Root endpoint error:', error.message);
    }

    console.log('');

    // Test 2: Health check
    try {
        console.log('❤️  Testing health endpoint...');
        const response = await fetch(`${RAILWAY_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            console.log('✅ Health check passed!');
            console.log(`   Environment: ${data.environment}`);
            console.log(`   Timestamp: ${data.timestamp}`);
        } else {
            console.log('❌ Health check failed:', data);
        }
    } catch (error) {
        console.log('❌ Health check error:', error.message);
    }

    console.log('');

    // Test 3: Component types
    try {
        console.log('📋 Testing component types endpoint...');
        const response = await fetch(`${RAILWAY_URL}/api/component-types`);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Component types endpoint working!');
            console.log(`   Found ${data.data.length} component types`);
        } else {
            console.log('❌ Component types failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Component types error:', error.message);
    }

    console.log('');

    // Test 4: Generate component
    try {
        console.log('🔧 Testing component generation...');
        const response = await fetch(`${RAILWAY_URL}/api/generate-component`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: "RailwayButton",
                type: "button",
                variant: "default",
                description: "A test button for Railway deployment"
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Component generation working!');
            console.log(`   Generated code length: ${data.data.code.length} characters`);
            console.log(`   Dependencies: ${data.data.dependencies.length}`);
        } else {
            console.log('❌ Component generation failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Component generation error:', error.message);
    }

    console.log('');

    // Test 5: Get template
    try {
        console.log('📄 Testing template endpoint...');
        const response = await fetch(`${RAILWAY_URL}/api/component-template/button`);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Template endpoint working!');
            console.log(`   Template: ${data.data.name}`);
            console.log(`   Variants: ${data.data.variants.join(', ')}`);
        } else {
            console.log('❌ Template endpoint failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Template endpoint error:', error.message);
    }

    console.log('\n🎉 Railway deployment testing complete!');
    console.log('\n📝 To test with your actual Railway URL:');
    console.log('1. Replace RAILWAY_URL in this script with your actual deployment URL');
    console.log('2. Or set environment variable: RAILWAY_URL=https://your-app.railway.app');
    console.log('3. Run: node test-railway.js');
}

// Instructions
if (RAILWAY_URL.includes('your-app')) {
    console.log(`
📝 SETUP INSTRUCTIONS:
1. Deploy your app to Railway
2. Get your Railway app URL (e.g., https://component-builder-mcp-server-production.railway.app)
3. Update RAILWAY_URL in this script or set environment variable:
   export RAILWAY_URL=https://your-app.railway.app
4. Run this test script: node test-railway.js

Example Railway URL: https://component-builder-mcp-server-production.railway.app
`);
} else {
    // Run tests if URL is configured
    testRailwayDeployment().catch(console.error);
}

export { testRailwayDeployment };