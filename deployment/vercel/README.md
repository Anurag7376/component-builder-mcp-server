# Vercel Deployment for Component Builder MCP Server

This directory contains the Vercel deployment configuration for the Component Builder MCP Server.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/component-builder-mcp-server&project-name=component-builder-mcp&repository-name=component-builder-mcp)

## Manual Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy from project root**:

   ```bash
   cd component-builder-mcp-server
   vercel --prod
   ```

4. **Or deploy using this config**:
   ```bash
   vercel --prod --local-config deployment/vercel/vercel.json
   ```

## API Endpoints

Once deployed, your API will be available at:

- `POST /api/generate-component` - Generate a new component
- `POST /api/validate-component` - Validate component code
- `GET /api/component-types` - List available component types
- `GET /api/component-template?type=<type>` - Get component template

## Environment Variables

Set these in your Vercel dashboard:

- `NODE_ENV=production`
- `API_KEY` (optional, for authentication)

## Usage Example

```javascript
// Generate a component
const response = await fetch(
  "https://your-app.vercel.app/api/generate-component",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "CustomButton",
      type: "button",
      variant: "primary",
      children: true,
    }),
  }
);

const result = await response.json();
console.log(result.data.code); // Generated component code
```

## File Structure

```
deployment/vercel/
├── api/
│   ├── generate-component.ts    # Component generation endpoint
│   ├── validate-component.ts    # Component validation endpoint
│   ├── component-types.ts       # List component types
│   └── component-template.ts    # Get component template
├── vercel.json                  # Vercel configuration
├── package.json                 # Dependencies for deployment
├── tsconfig.json               # TypeScript config
└── README.md                   # This file
```

## Troubleshooting

### Build Errors

- Ensure all dependencies are listed in `package.json`
- Check TypeScript configuration
- Verify template files are included

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify environment variables
- Ensure CORS headers are set correctly

### Template Loading Issues

- Template files should be included in the deployment
- Check `includeFiles` configuration in `vercel.json`
- Verify file paths are correct

## Security Notes

- Consider adding rate limiting for production use
- Implement API key authentication if needed
- Validate all input data thoroughly
- Set appropriate CORS policies

## Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking with Sentry or similar
- Monitor function execution times and memory usage
