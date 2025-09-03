# Railway Deployment Guide for Component Builder MCP Server

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR_TEMPLATE_ID)

## Manual Deployment Steps

### 1. Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Component Builder MCP Server"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/component-builder-mcp-server.git
git push -u origin main
```

### 2. Deploy on Railway

1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `component-builder-mcp-server` repository
6. Railway will automatically detect the Node.js project and deploy

### 3. Configuration (Automatic)

Railway will automatically:
- ✅ Detect Node.js and TypeScript
- ✅ Run `npm run build` during deployment
- ✅ Start the server with `npm start`
- ✅ Use the `/health` endpoint for health checks
- ✅ Assign a public URL

## Environment Variables (Optional)

If you need custom configuration, add these in Railway dashboard:

```
NODE_ENV=production
PORT=3001
```

## Available Endpoints

After deployment, your API will be available at:

- `https://your-app.railway.app/` - API documentation
- `https://your-app.railway.app/api/generate-component` - Generate components
- `https://your-app.railway.app/api/validate-component` - Validate components
- `https://your-app.railway.app/api/component-types` - List component types
- `https://your-app.railway.app/api/component-template/:type` - Get template details
- `https://your-app.railway.app/health` - Health check

## Testing Your Deployment

1. Visit your Railway app URL
2. Check the health endpoint: `GET /health`
3. Test component generation:

```bash
curl -X POST https://your-app.railway.app/api/generate-component \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestButton",
    "type": "button",
    "variant": "default",
    "description": "A test button"
  }'
```

## Railway Features

✅ **Free Tier**: 500 hours/month  
✅ **Automatic HTTPS**  
✅ **Custom domains**  
✅ **Environment variables**  
✅ **Logs and monitoring**  
✅ **Automatic deployments from GitHub**  
✅ **Database support** (PostgreSQL, MySQL, Redis)  

## Scaling

Railway automatically handles:
- Load balancing
- Auto-scaling based on traffic
- Health checks and restarts
- SSL certificates

## Troubleshooting

### Build Issues
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation with `npm run build`

### Runtime Issues
- Check application logs in Railway dashboard
- Verify environment variables are set correctly
- Test health endpoint: `/health`

### Template Issues
- Ensure templates are copied to `dist/templates/`
- Check that `copy-templates` script runs during build

## Cost

Railway Free Tier includes:
- 500 execution hours per month
- 1GB memory per service
- 1GB disk per service
- 100GB network bandwidth

Perfect for development and small production workloads!