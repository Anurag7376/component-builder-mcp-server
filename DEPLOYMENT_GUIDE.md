# Component Builder MCP Server - Vercel Deployment Guide

## Option 1: Deploy via GitHub (Recommended)

1. **Create GitHub Repository:**
   - Go to https://github.com and create a new repository
   - Name it `component-builder-mcp-server`
   - Don't initialize with README

2. **Push Code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/component-builder-mcp-server.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your `component-builder-mcp-server` repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy"

## Option 2: Direct Upload to Vercel

1. **Zip the Project:**
   - Create a ZIP file of your entire project folder (excluding `node_modules`, `.git`)
   
2. **Upload to Vercel:**
   - Go to https://vercel.com
   - Sign up/login
   - Drag and drop your ZIP file
   - Vercel will deploy automatically

## Deployment Configuration

Your project is already configured with:
- ✅ `vercel.json` configuration file
- ✅ API endpoints in `/api` folder
- ✅ TypeScript build configuration
- ✅ Template files inclusion

## Available API Endpoints

After deployment, your MCP server will be available at:
- `https://your-project.vercel.app/api/generate-component` - Generate components
- `https://your-project.vercel.app/api/validate-component` - Validate components  
- `https://your-project.vercel.app/api/component-types` - List available types
- `https://your-project.vercel.app/api/component-template` - Get template details

## Testing Your Deployment

Use the example usage file in `deployment/vercel/example-usage.js` to test your deployed API.

## Project Structure
```
component-builder-mcp-server/
├── api/                     # Vercel API functions
│   ├── generate-component.ts
│   ├── validate-component.ts
│   ├── component-types.ts
│   └── component-template.ts
├── src/                     # Source code
│   ├── templates/          # Component templates
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities
├── vercel.json             # Vercel configuration
└── package.json            # Dependencies
```

## Environment Variables (Optional)

If you need any environment variables, add them in Vercel dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add any required variables

## Free Tier Limits

Vercel free tier includes:
- 100GB bandwidth per month
- 100 serverless function invocations per day
- Automatic HTTPS
- Global CDN