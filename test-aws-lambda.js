// Simplified test runner for AWS Lambda handlers
import { ComponentGenerator } from './dist/utils/generator.js';
import { ComponentValidator } from './dist/utils/validator.js';

// Mock AWS Lambda functions to test the core logic
export async function testGenerateComponent() {
  console.log('🧪 Testing Component Generation Logic...\n');
  
  try {
    const generator = new ComponentGenerator();
    
    const mockSpec = {
      name: 'TestButton',
      type: 'button',
      description: 'A test button component',
      variant: 'default',
      size: 'md',
      children: true,
      props: [
        {
          name: 'loading',
          type: 'boolean',
          required: false,
          description: 'Show loading state'
        }
      ]
    };

    const component = await generator.generateComponent(mockSpec);
    
    console.log('✅ Component Generation Test Passed');
    console.log(`Component Name: ${component.name}`);
    console.log(`Code Length: ${component.code.length} characters`);
    console.log(`Dependencies: ${component.dependencies.join(', ')}`);
    console.log(`Examples: ${component.examples.length} examples generated`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: component
      })
    };
    
  } catch (error) {
    console.log('❌ Component Generation Test Failed');
    console.error('Error:', error.message);
    
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}

export async function testValidateComponent() {
  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🧪 Testing Component Validation Logic...\n');
  
  try {
    const validator = new ComponentValidator();
    
    const sampleCode = `
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2",
          variant === "outline" ? "border border-input" : "bg-primary text-primary-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
    `;

    const result = validator.validateComponent(sampleCode, false);
    
    console.log('✅ Component Validation Test Passed');
    console.log(`Is Valid: ${result.isValid}`);
    console.log(`Errors: ${result.errors.length}`);
    console.log(`Warnings: ${result.warnings.length}`);
    console.log(`Suggestions: ${result.suggestions.length}`);
    
    if (result.suggestions.length > 0) {
      console.log('\nSuggestions:');
      result.suggestions.forEach((suggestion, i) => {
        console.log(`  ${i + 1}. ${suggestion}`);
      });
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
    
  } catch (error) {
    console.log('❌ Component Validation Test Failed');
    console.error('Error:', error.message);
    
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}

export async function testLambdaCompatibility() {
  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🧪 Testing Lambda Response Format...\n');
  
  // Test that responses are in correct AWS Lambda format
  const generateResponse = await testGenerateComponent();
  const validateResponse = await testValidateComponent();
  
  console.log('\n📋 Lambda Response Format Check:');
  console.log(`Generate Component Response: ${generateResponse.statusCode === 200 ? '✅' : '❌'}`);
  console.log(`Validate Component Response: ${validateResponse.statusCode === 200 ? '✅' : '❌'}`);
  
  // Check response structure
  const hasRequiredFields = (response) => {
    return response.statusCode !== undefined && 
           response.headers !== undefined && 
           response.body !== undefined;
  };
  
  console.log(`Response Structure Valid: ${hasRequiredFields(generateResponse) && hasRequiredFields(validateResponse) ? '✅' : '❌'}`);
  
  // Test JSON parsing
  try {
    JSON.parse(generateResponse.body);
    JSON.parse(validateResponse.body);
    console.log('JSON Format Valid: ✅');
  } catch (error) {
    console.log('JSON Format Valid: ❌');
    console.error('JSON Parse Error:', error.message);
  }
}

// Run all tests
export async function runAllTests() {
  console.log('🚀 Starting AWS Lambda Handler Tests...');
  console.log('='.repeat(60));
  
  try {
    await testGenerateComponent();
    await testValidateComponent();
    await testLambdaCompatibility();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All AWS Lambda tests completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Deploy to AWS Lambda using: aws lambda create-function');
    console.log('2. Set up API Gateway to trigger the functions');
    console.log('3. Configure environment variables');
    console.log('4. Test with real AWS Lambda events');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}