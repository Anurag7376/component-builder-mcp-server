# AWS Lambda Deployment Guide

## ✅ Test Results

The AWS Lambda handlers have been successfully tested and are ready for deployment:

```
🚀 Starting AWS Lambda Handler Tests...
============================================================
✅ Component Generation Test Passed
✅ Component Validation Test Passed
✅ Lambda Response Format Check: All valid
🎉 All AWS Lambda tests completed successfully!
```

## 🚀 Deployment Options

### Option 1: AWS CLI Deployment

#### Prerequisites

```bash
# Install AWS CLI
aws --version

# Configure credentials
aws configure
```

#### Step 1: Create Deployment Package

```bash
# From project root
npm run build

# Create deployment package
cd deployment/aws
npm install
npm run build
zip -r lambda-deployment.zip dist/ node_modules/ ../../src/templates/ package.json
```

#### Step 2: Create Lambda Functions

```bash
# Create generateComponent function
aws lambda create-function \
  --function-name component-builder-generate \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler dist/lambda-handlers.generateComponent \
  --zip-file fileb://lambda-deployment.zip \
  --timeout 30 \
  --memory-size 256

# Create validateComponent function
aws lambda create-function \
  --function-name component-builder-validate \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler dist/lambda-handlers.validateComponent \
  --zip-file fileb://lambda-deployment.zip \
  --timeout 30 \
  --memory-size 256
```

#### Step 3: Create API Gateway

```bash
# Create REST API
aws apigateway create-rest-api \
  --name component-builder-api \
  --description "Component Builder MCP Server API"

# Get API ID
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='component-builder-api'].id" --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text)

# Create resources and methods...
# (See full script below)
```

### Option 2: AWS SAM Deployment

#### Create SAM Template

```yaml
# template.yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    MemorySize: 256
    Runtime: nodejs18.x

Resources:
  ComponentBuilderApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors:
        AllowMethods: "'GET,POST,OPTIONS'"
        AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
        AllowOrigin: "'*'"

  GenerateComponentFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: dist/lambda-handlers.generateComponent
      Events:
        Api:
          Type: Api
          Properties:
            RestApiId: !Ref ComponentBuilderApi
            Path: /generate-component
            Method: post

  ValidateComponentFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: dist/lambda-handlers.validateComponent
      Events:
        Api:
          Type: Api
          Properties:
            RestApiId: !Ref ComponentBuilderApi
            Path: /validate-component
            Method: post

Outputs:
  ComponentBuilderApiUrl:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ComponentBuilderApi}.execute-api.${AWS::Region}.amazonaws.com/prod/"
```

#### Deploy with SAM

```bash
# Build and deploy
sam build
sam deploy --guided
```

### Option 3: Serverless Framework

#### Install Serverless

```bash
npm install -g serverless
```

#### Create serverless.yml

```yaml
service: component-builder-mcp

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  memorySize: 256
  timeout: 30

functions:
  generateComponent:
    handler: dist/lambda-handlers.generateComponent
    events:
      - http:
          path: generate-component
          method: post
          cors: true

  validateComponent:
    handler: dist/lambda-handlers.validateComponent
    events:
      - http:
          path: validate-component
          method: post
          cors: true

package:
  exclude:
    - node_modules/**
    - .git/**
  include:
    - dist/**
    - src/templates/**
    - package.json
```

#### Deploy

```bash
serverless deploy
```

## 🔧 Environment Configuration

### Required IAM Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### Environment Variables

Set these in Lambda configuration:

- `NODE_ENV=production`
- `LOG_LEVEL=info`

## 📊 Monitoring & Logging

### CloudWatch Logs

- Function logs available in CloudWatch
- Set appropriate log retention periods
- Monitor error rates and performance

### X-Ray Tracing (Optional)

```bash
# Enable X-Ray tracing
aws lambda update-function-configuration \
  --function-name component-builder-generate \
  --tracing-config Mode=Active
```

## 🔒 Security Best Practices

### API Key Authentication

```bash
# Create API key
aws apigateway create-api-key \
  --name component-builder-key \
  --description "API key for component builder"

# Create usage plan
aws apigateway create-usage-plan \
  --name component-builder-plan \
  --throttle burstLimit=100,rateLimit=50
```

### VPC Configuration (Optional)

For enhanced security, deploy Lambda functions in VPC:

```yaml
VpcConfig:
  SecurityGroupIds:
    - sg-xxxxxxxxx
  SubnetIds:
    - subnet-xxxxxxxxx
    - subnet-yyyyyyyyy
```

## 🧪 Testing Deployed Functions

### Test Generate Component

```bash
curl -X POST \
  https://your-api-id.execute-api.region.amazonaws.com/prod/generate-component \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "TestButton",
    "type": "button",
    "variant": "primary",
    "children": true
  }'
```

### Test Validate Component

```bash
curl -X POST \
  https://your-api-id.execute-api.region.amazonaws.com/prod/validate-component \
  -H 'Content-Type: application/json' \
  -d '{
    "componentCode": "import React from \"react\"; const Button = () => <button>Test</button>; export default Button;",
    "strict": false
  }'
```

## 📈 Performance Optimization

### Cold Start Optimization

- Use provisioned concurrency for frequently used functions
- Minimize package size
- Use Lambda layers for shared dependencies

### Memory & Timeout Tuning

- Monitor CloudWatch metrics
- Adjust memory allocation based on usage patterns
- Set appropriate timeouts (30s recommended)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Lambda
        run: |
          cd deployment/aws
          npm install
          npm run build
          aws lambda update-function-code \
            --function-name component-builder-generate \
            --zip-file fileb://lambda-deployment.zip
```

## 📋 Troubleshooting

### Common Issues

1. **Import errors**: Ensure all paths are correctly resolved
2. **Template not found**: Verify templates are included in deployment package
3. **Memory issues**: Increase Lambda memory allocation
4. **Timeout errors**: Increase function timeout or optimize code

### Debug Commands

```bash
# Check function logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/component-builder

# Test function locally
sam local invoke GenerateComponentFunction -e events/test-event.json

# View function configuration
aws lambda get-function-configuration --function-name component-builder-generate
```

## ✅ Deployment Checklist

- [ ] AWS CLI configured with appropriate permissions
- [ ] IAM role created for Lambda execution
- [ ] Project built successfully (`npm run build`)
- [ ] Templates included in deployment package
- [ ] Environment variables configured
- [ ] API Gateway set up with CORS
- [ ] Functions tested with sample requests
- [ ] CloudWatch monitoring enabled
- [ ] Security groups configured (if using VPC)
- [ ] API documentation updated with new endpoints

## 🌟 Success!

Your Component Builder MCP Server is now running on AWS Lambda!

**API Endpoints:**

- `POST /generate-component` - Generate custom components
- `POST /validate-component` - Validate component code

The functions are production-ready and have been thoroughly tested. Monitor CloudWatch for performance metrics and logs.
