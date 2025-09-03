// React Native client for accessing MCP server
import { ComponentSpec, GeneratedComponent, ValidationResult } from './types';

export class MobileComponentGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://your-mcp-server.com/api') {
    this.baseUrl = baseUrl;
  }

  async generateComponent(spec: ComponentSpec): Promise<GeneratedComponent> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spec)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (error) {
      throw new Error(`Failed to generate component: ${error}`);
    }
  }

  async validateComponent(code: string, strict: boolean = false): Promise<ValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentCode: code, strict })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (error) {
      throw new Error(`Failed to validate component: ${error}`);
    }
  }

  async getComponentTypes(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/component-types`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (error) {
      throw new Error(`Failed to get component types: ${error}`);
    }
  }
}