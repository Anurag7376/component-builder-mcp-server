/**
 * Universal Component Builder Client
 * Works in Node.js, Browser, React Native, and other JavaScript environments
 */

class ComponentBuilderClient {
  constructor(baseURL = 'https://your-app-name.railway.app') {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.fetch = this._getFetchFunction();
  }

  // Auto-detect fetch function for different environments
  _getFetchFunction() {
    // Node.js environment
    if (typeof window === 'undefined' && typeof global !== 'undefined') {
      try {
        return require('node-fetch');
      } catch (e) {
        throw new Error('Please install node-fetch: npm install node-fetch');
      }
    }
    // Browser/React Native environment
    if (typeof fetch !== 'undefined') {
      return fetch;
    }
    throw new Error('No fetch implementation available');
  }

  // Make HTTP request with error handling
  async _request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await this.fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Could not connect to ${this.baseURL}`);
      }
      throw error;
    }
  }

  // Health check
  async health() {
    const result = await this._request('/health');
    return result;
  }

  // Generate a component
  async generateComponent(spec) {
    if (!spec || !spec.name || !spec.type) {
      throw new Error('Component spec must include name and type');
    }

    const result = await this._request('/api/generate-component', {
      method: 'POST',
      body: JSON.stringify(spec)
    });
    
    return result.data;
  }

  // Validate component code
  async validateComponent(componentCode, strict = true) {
    if (!componentCode) {
      throw new Error('Component code is required');
    }

    const result = await this._request('/api/validate-component', {
      method: 'POST',
      body: JSON.stringify({ componentCode, strict })
    });
    
    return result.data;
  }

  // Get available component types
  async getComponentTypes() {
    const result = await this._request('/api/component-types');
    return result.data;
  }

  // Get template details for a component type
  async getComponentTemplate(type) {
    if (!type) {
      throw new Error('Component type is required');
    }

    const result = await this._request(`/api/component-template/${type}`);
    return result.data;
  }

  // Batch generate multiple components
  async generateMultipleComponents(specs) {
    if (!Array.isArray(specs)) {
      throw new Error('Specs must be an array');
    }

    const results = await Promise.allSettled(
      specs.map(spec => this.generateComponent(spec))
    );

    return results.map((result, index) => ({
      spec: specs[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));
  }

  // Quick component generation with common patterns
  async quickGenerate(name, type, variant = 'default') {
    return this.generateComponent({
      name,
      type,
      variant,
      description: `A ${variant} ${type} component`
    });
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js
  module.exports = ComponentBuilderClient;
} else if (typeof window !== 'undefined') {
  // Browser
  window.ComponentBuilderClient = ComponentBuilderClient;
}

// Example usage and documentation
ComponentBuilderClient.examples = {
  // Basic usage
  basic: `
const client = new ComponentBuilderClient('https://your-app.railway.app');

// Generate a button
const button = await client.generateComponent({
  name: 'MyButton',
  type: 'button',
  variant: 'primary',
  description: 'A primary action button'
});

console.log(button.code);
  `,

  // React Native usage
  reactNative: `
import ComponentBuilderClient from './ComponentBuilderClient';

const client = new ComponentBuilderClient('https://your-app.railway.app');

const generateComponentButton = async () => {
  try {
    const component = await client.quickGenerate('ActionButton', 'button', 'primary');
    setGeneratedCode(component.code);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
  `,

  // Node.js usage
  nodejs: `
const ComponentBuilderClient = require('./ComponentBuilderClient');

const client = new ComponentBuilderClient('https://your-app.railway.app');

async function main() {
  // Check health
  const health = await client.health();
  console.log('Server status:', health.status);

  // Get available types
  const types = await client.getComponentTypes();
  console.log('Available types:', types);

  // Generate component
  const component = await client.generateComponent({
    name: 'UserCard',
    type: 'card',
    variant: 'elevated',
    description: 'A card for displaying user information'
  });

  console.log('Generated component:', component.code);
}

main().catch(console.error);
  `,

  // Browser usage
  browser: `
<!-- Include in HTML -->
<script src="./ComponentBuilderClient.js"></script>
<script>
const client = new ComponentBuilderClient('https://your-app.railway.app');

async function generateComponent() {
  try {
    const component = await client.generateComponent({
      name: 'ContactForm',
      type: 'form',
      variant: 'default',
      description: 'A contact form component'
    });
    
    document.getElementById('output').textContent = component.code;
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
</script>
  `
};

// CLI-like interface for quick testing
ComponentBuilderClient.cli = {
  async test(baseURL) {
    const client = new ComponentBuilderClient(baseURL);
    
    console.log('🧪 Testing Component Builder API...');
    console.log(`🔗 Base URL: ${client.baseURL}`);
    
    try {
      // Health check
      const health = await client.health();
      console.log('✅ Health check passed:', health.status);
      
      // Get types
      const types = await client.getComponentTypes();
      console.log(`📋 Found ${types.length} component types`);
      
      // Generate test component
      const component = await client.quickGenerate('TestButton', 'button');
      console.log('🔧 Generated test component successfully');
      console.log(`📝 Code length: ${component.code.length} characters`);
      
      console.log('🎉 All tests passed!');
      return true;
    } catch (error) {
      console.log('❌ Test failed:', error.message);
      return false;
    }
  }
};

// Export the class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentBuilderClient;
}