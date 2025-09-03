// Test script for deployed Vercel API
// Replace YOUR_VERCEL_URL with your actual deployment URL

const VERCEL_URL = "https://your-project-name.vercel.app";

async function testDeployment() {
  console.log("🚀 Testing Component Builder MCP Server Deployment...\n");

  // Test 1: Get component types
  try {
    console.log("📋 Testing /api/component-types...");
    const response = await fetch(`${VERCEL_URL}/api/component-types`);
    const data = await response.json();

    if (data.success) {
      console.log("✅ Component types endpoint working!");
      console.log(`   Found ${data.data.length} component types`);
    } else {
      console.log("❌ Component types endpoint failed:", data.error);
    }
  } catch (error) {
    console.log("❌ Component types endpoint error:", error.message);
  }

  console.log("");

  // Test 2: Generate a simple button
  try {
    console.log("🔧 Testing /api/generate-component...");
    const response = await fetch(`${VERCEL_URL}/api/generate-component`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "TestButton",
        type: "button",
        variant: "default",
        description: "A test button component",
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("✅ Component generation working!");
      console.log("   Generated component code length:", data.data.code.length);
    } else {
      console.log("❌ Component generation failed:", data.error);
    }
  } catch (error) {
    console.log("❌ Component generation error:", error.message);
  }

  console.log("");

  // Test 3: Get template details
  try {
    console.log("📄 Testing /api/component-template...");
    const response = await fetch(
      `${VERCEL_URL}/api/component-template?type=button`
    );
    const data = await response.json();

    if (data.success) {
      console.log("✅ Template endpoint working!");
      console.log(`   Template name: ${data.data.name}`);
    } else {
      console.log("❌ Template endpoint failed:", data.error);
    }
  } catch (error) {
    console.log("❌ Template endpoint error:", error.message);
  }

  console.log("\n🎉 Testing complete!");
}

// Instructions for usage
console.log(`
📝 INSTRUCTIONS:
1. Replace VERCEL_URL above with your actual Vercel deployment URL
2. Run this script: node test-deployment.js
3. Check that all endpoints return success

Example Vercel URL: https://component-builder-mcp-server.vercel.app
`);

// Uncomment the line below after updating VERCEL_URL
// testDeployment();

export { testDeployment };
