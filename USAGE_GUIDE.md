# Using Your Component Builder MCP Server - Multi-Device Guide

## 🌐 Your Deployed API

After Railway deployment, your MCP server is available as a REST API at:
```
https://your-app-name.railway.app
```

Replace `your-app-name` with your actual Railway app URL.

## 📱 Device Usage Options

### 1. Web Browser (Any Device)

**Direct API Testing:**
Visit your Railway URL in any browser to see the API documentation:
```
https://your-app-name.railway.app/
```

**Test Endpoints:**
- Health check: `https://your-app-name.railway.app/health`
- Component types: `https://your-app-name.railway.app/api/component-types`

### 2. Mobile Devices (iOS/Android)

#### Option A: Web Browser
Use any mobile browser to access your API endpoints.

#### Option B: HTTP Client Apps
**iOS:**
- **HTTP Client** app
- **Postman** mobile app
- **REST Client** app

**Android:**
- **HTTP Request** app
- **Postman** mobile app
- **REST API Client** app

#### Option C: Custom Mobile App Integration
```javascript
// React Native example
const generateComponent = async (spec) => {
  const response = await fetch('https://your-app-name.railway.app/api/generate-component', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spec)
  });
  return await response.json();
};
```

### 3. Desktop Applications

#### Option A: CLI Usage
```bash
# Install curl (if not available)
# Windows: Use PowerShell or install via Chocolatey
# macOS: Pre-installed
# Linux: sudo apt install curl

# Generate a component
curl -X POST https://your-app-name.railway.app/api/generate-component \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyButton",
    "type": "button",
    "variant": "default",
    "description": "A custom button component"
  }'
```

#### Option B: Postman Desktop
1. Download Postman from https://postman.com
2. Create a new collection
3. Add requests for each endpoint
4. Share collection with team members

#### Option C: VS Code Extension Integration
```javascript
// VS Code extension integration
const axios = require('axios');

const generateComponentFromVSCode = async (spec) => {
  try {
    const response = await axios.post(
      'https://your-app-name.railway.app/api/generate-component',
      spec
    );
    return response.data;
  } catch (error) {
    console.error('Component generation failed:', error);
  }
};
```

### 4. Development Environment Integration

#### Node.js Projects
```javascript
// Install in your project
npm install axios

// Use in your code
const axios = require('axios');

const componentBuilder = {
  baseURL: 'https://your-app-name.railway.app',
  
  async generateComponent(spec) {
    const response = await axios.post(`${this.baseURL}/api/generate-component`, spec);
    return response.data;
  },
  
  async validateComponent(code, strict = true) {
    const response = await axios.post(`${this.baseURL}/api/validate-component`, {
      componentCode: code,
      strict
    });
    return response.data;
  },
  
  async getComponentTypes() {
    const response = await axios.get(`${this.baseURL}/api/component-types`);
    return response.data;
  }
};

module.exports = componentBuilder;
```

#### Python Projects
```python
import requests

class ComponentBuilder:
    def __init__(self, base_url="https://your-app-name.railway.app"):
        self.base_url = base_url
    
    def generate_component(self, spec):
        response = requests.post(
            f"{self.base_url}/api/generate-component",
            json=spec
        )
        return response.json()
    
    def validate_component(self, code, strict=True):
        response = requests.post(
            f"{self.base_url}/api/validate-component",
            json={"componentCode": code, "strict": strict}
        )
        return response.json()
    
    def get_component_types(self):
        response = requests.get(f"{self.base_url}/api/component-types")
        return response.json()

# Usage
builder = ComponentBuilder()
result = builder.generate_component({
    "name": "MyButton",
    "type": "button",
    "variant": "default",
    "description": "A custom button"
})
```

### 5. Team Collaboration

#### Shared Postman Workspace
1. Create a Postman workspace
2. Add all API endpoints
3. Share workspace with team members
4. Everyone can use the same API collection

#### Documentation Website
Create a simple HTML page that team members can bookmark:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Component Builder API</title>
</head>
<body>
    <h1>Component Builder MCP Server</h1>
    <p>Base URL: <code>https://your-app-name.railway.app</code></p>
    
    <h2>Quick Links</h2>
    <ul>
        <li><a href="https://your-app-name.railway.app/">API Documentation</a></li>
        <li><a href="https://your-app-name.railway.app/health">Health Check</a></li>
        <li><a href="https://your-app-name.railway.app/api/component-types">Component Types</a></li>
    </ul>
    
    <h2>Example Usage</h2>
    <pre>
curl -X POST https://your-app-name.railway.app/api/generate-component \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyButton",
    "type": "button",
    "variant": "default",
    "description": "A custom button"
  }'
    </pre>
</body>
</html>
```

## 🔗 Integration Examples

### Web Application Integration
```javascript
// React/Vue/Angular integration
const useComponentBuilder = () => {
  const API_BASE = 'https://your-app-name.railway.app';
  
  const generateComponent = async (spec) => {
    const response = await fetch(`${API_BASE}/api/generate-component`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spec)
    });
    return await response.json();
  };
  
  return { generateComponent };
};
```

### AI Assistant Integration
```javascript
// Claude Desktop MCP client configuration
{
  "mcpServers": {
    "component-builder": {
      "command": "node",
      "args": ["path/to/mcp-http-client.js"],
      "env": {
        "MCP_SERVER_URL": "https://your-app-name.railway.app"
      }
    }
  }
}
```

## 📋 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API documentation |
| GET | `/health` | Health check |
| GET | `/api/component-types` | List all component types |
| GET | `/api/component-template/:type` | Get template details |
| POST | `/api/generate-component` | Generate a component |
| POST | `/api/validate-component` | Validate component code |

## 🚀 Getting Started Checklist

- [ ] Get your Railway app URL
- [ ] Test health endpoint in browser
- [ ] Try generating a component with curl/Postman
- [ ] Set up integration in your preferred development environment
- [ ] Share API documentation with team members
- [ ] Create bookmarks for frequently used endpoints

## 💡 Pro Tips

1. **Bookmark the API**: Save `https://your-app-name.railway.app/` in your browser
2. **Use Environment Variables**: Store the API URL in environment variables for easy switching
3. **Create Wrapper Functions**: Build reusable functions for common operations
4. **Monitor Usage**: Check Railway dashboard for API usage and performance
5. **Version Control**: Keep API integration code in version control for team sharing