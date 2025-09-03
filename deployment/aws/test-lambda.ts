// Test runner for AWS Lambda handlers
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { generateComponent, validateComponent } from './lambda-handlers.js';

// Mock AWS Lambda context
const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'component-builder-test',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:component-builder-test',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/component-builder-test',
  logStreamName: '2023/01/01/[$LATEST]test',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {}
};

// Test data
const generateComponentEvent: APIGatewayProxyEvent = {
  body: JSON.stringify({
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
  }),
  headers: {
    'Content-Type': 'application/json'
  },
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/generate-component',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '123456789012',
    apiId: 'test-api',
    protocol: 'HTTP/1.1',
    httpMethod: 'POST',
    path: '/generate-component',
    stage: 'test',
    requestId: 'test-request',
    requestTime: '01/Jan/2023:00:00:00 +0000',
    requestTimeEpoch: 1672531200,
    resourceId: 'test-resource',
    resourcePath: '/generate-component',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: 'test-agent',
      userArn: null,
      clientCert: null
    },
    authorizer: null
  },
  resource: '/generate-component'
};

const validateComponentEvent: APIGatewayProxyEvent = {
  ...generateComponentEvent,
  body: JSON.stringify({
    componentCode: `
import * as React from \"react\";
import { cn } from \"@/lib/utils\";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: \"default\" | \"outline\";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = \"default\", ...props }, ref) => {
    return (
      <button
        className={cn(
          \"inline-flex items-center justify-center rounded-md px-4 py-2\",
          variant === \"outline\" ? \"border border-input\" : \"bg-primary text-primary-foreground\",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = \"Button\";

export { Button };
    `,
    strict: false
  }),
  path: '/validate-component'
};

async function testLambdaFunctions() {
  console.log('🧪 Testing AWS Lambda Functions...\n');

  try {
    // Test 1: Generate Component
    console.log('Test 1: Generate Component Function');
    const generateResult = await generateComponent(generateComponentEvent, mockContext, () => {});
    
    console.log(`Status Code: ${generateResult.statusCode}`);
    if (generateResult.statusCode === 200) {
      const response = JSON.parse(generateResult.body);
      console.log('✅ Component generation successful');
      console.log(`Component name: ${response.data.name}`);
      console.log(`Code length: ${response.data.code.length} characters`);
    } else {
      console.log('❌ Component generation failed');
      console.log('Response:', generateResult.body);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Validate Component
    console.log('Test 2: Validate Component Function');
    const validateResult = await validateComponent(validateComponentEvent, mockContext, () => {});
    
    console.log(`Status Code: ${validateResult.statusCode}`);
    if (validateResult.statusCode === 200) {
      const response = JSON.parse(validateResult.body);
      console.log('✅ Component validation successful');
      console.log(`Is valid: ${response.data.isValid}`);
      console.log(`Errors: ${response.data.errors.length}`);
      console.log(`Warnings: ${response.data.warnings.length}`);
      console.log(`Suggestions: ${response.data.suggestions.length}`);
    } else {
      console.log('❌ Component validation failed');
      console.log('Response:', validateResult.body);
    }

    console.log('\n🎉 All Lambda function tests completed!');

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Run tests
testLambdaFunctions().catch(console.error);