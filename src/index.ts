#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ComponentGenerator } from './utils/generator.js';
import { ComponentValidator } from './utils/validator.js';
import { 
  ComponentSpecSchema, 
  ComponentValidationSchema, 
  ComponentTemplateSchema 
} from './types/component.js';
import { componentTemplates, getAllTemplateTypes, getTemplate } from './templates/index.js';

class ComponentBuilderServer {
  private server: Server;
  private generator: ComponentGenerator;
  private validator: ComponentValidator;

  constructor() {
    this.server = new Server(
      {
        name: 'component-builder-mcp-server',
        version: '1.0.0',
      }
    );

    this.generator = new ComponentGenerator();
    this.validator = new ComponentValidator();

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_component',
          description: 'Generate a custom React component based on Shadcn UI standards',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Component name (PascalCase recommended)',
              },
              type: {
                type: 'string',
                enum: [
                  'button', 'input', 'card', 'modal', 'dropdown', 'form', 'navigation', 'layout', 
                  'data-display', 'feedback', 'custom', 'select', 'checkbox', 'radio', 'textarea', 
                  'switch', 'slider', 'tabs', 'accordion', 'alert', 'badge', 'avatar', 'breadcrumb', 
                  'pagination', 'progress', 'skeleton', 'spinner', 'tooltip', 'popover', 'dialog', 
                  'sheet', 'toast', 'table', 'calendar', 'date-picker', 'command', 'context-menu', 
                  'hover-card', 'menubar', 'navigation-menu', 'scroll-area', 'separator', 'toggle', 
                  'toggle-group'
                ],
                description: 'Type of component to generate',
              },
              variant: {
                type: 'string',
                description: 'Component variant (optional)',
              },
              size: {
                type: 'string',
                enum: ['sm', 'md', 'lg', 'xl'],
                description: 'Component size',
                default: 'md',
              },
              description: {
                type: 'string',
                description: 'Component description for documentation',
              },
              props: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string' },
                    required: { type: 'boolean', default: false },
                    description: { type: 'string' },
                    defaultValue: { type: 'string' },
                  },
                  required: ['name', 'type'],
                },
                description: 'Component props definition',
              },
              styling: {
                type: 'object',
                properties: {
                  className: { type: 'string' },
                  variant: { type: 'string' },
                  colorScheme: {
                    type: 'string',
                    enum: ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost'],
                    default: 'default',
                  },
                },
                description: 'Styling configuration',
              },
              accessibility: {
                type: 'object',
                properties: {
                  ariaLabel: { type: 'string' },
                  role: { type: 'string' },
                  tabIndex: { type: 'number' },
                },
                description: 'Accessibility configuration',
              },
              children: {
                type: 'boolean',
                description: 'Whether component accepts children',
                default: false,
              },
              customContent: {
                type: 'string',
                description: 'Custom content/JSX for the component',
              },
            },
            required: ['name', 'type'],
          },
        },
        {
          name: 'validate_component',
          description: 'Validate a React component against Shadcn UI standards',
          inputSchema: {
            type: 'object',
            properties: {
              componentCode: {
                type: 'string',
                description: 'The React component code to validate',
              },
              strict: {
                type: 'boolean',
                description: 'Enable strict validation mode',
                default: false,
              },
            },
            required: ['componentCode'],
          },
        },
        {
          name: 'list_component_types',
          description: 'List all available component types and their templates',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_component_template',
          description: 'Get detailed information about a specific component template',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Component type to get template for',
              },
              variant: {
                type: 'string',
                description: 'Component variant (optional)',
              },
            },
            required: ['type'],
          },
        },
        {
          name: 'generate_component_examples',
          description: 'Generate usage examples for a component type',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Component type to generate examples for',
              },
              includeAdvanced: {
                type: 'boolean',
                description: 'Include advanced usage examples',
                default: false,
              },
            },
            required: ['type'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_component':
            return await this.handleGenerateComponent(args);
          
          case 'validate_component':
            return await this.handleValidateComponent(args);
          
          case 'list_component_types':
            return await this.handleListComponentTypes();
          
          case 'get_component_template':
            return await this.handleGetComponentTemplate(args);
          
          case 'generate_component_examples':
            return await this.handleGenerateComponentExamples(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private async handleGenerateComponent(args: any) {
    const spec = ComponentSpecSchema.parse(args);
    const component = await this.generator.generateComponent(spec);

    return {
      content: [
        {
          type: 'text',
          text: `# Generated Component: ${component.name}\n\n## Code\n\n\`\`\`tsx\n${component.code}\n\`\`\`\n\n## Imports\n\n\`\`\`tsx\n${component.imports.join('\n')}\n\`\`\`\n\n## Dependencies\n\n\`\`\`json\n${JSON.stringify(component.dependencies, null, 2)}\n\`\`\`\n\n## Documentation\n\n${component.documentation}\n\n## Examples\n\n${component.examples.map(example => `\`\`\`tsx\n${example}\n\`\`\``).join('\n\n')}`,
        },
      ],
    };
  }

  private async handleValidateComponent(args: any) {
    const { componentCode, strict } = ComponentValidationSchema.parse(args);
    const result = this.validator.validateComponent(componentCode, strict);

    let responseText = `# Component Validation Result\n\n`;
    responseText += `**Status:** ${result.isValid ? '✅ Valid' : '❌ Invalid'}\n\n`;

    if (result.errors.length > 0) {
      responseText += `## Errors\n\n`;
      result.errors.forEach((error, index) => {
        responseText += `${index + 1}. ❌ ${error}\n`;
      });
      responseText += '\n';
    }

    if (result.warnings.length > 0) {
      responseText += `## Warnings\n\n`;
      result.warnings.forEach((warning, index) => {
        responseText += `${index + 1}. ⚠️ ${warning}\n`;
      });
      responseText += '\n';
    }

    if (result.suggestions.length > 0) {
      responseText += `## Suggestions\n\n`;
      result.suggestions.forEach((suggestion, index) => {
        responseText += `${index + 1}. 💡 ${suggestion}\n`;
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  }

  private async handleListComponentTypes() {
    const types = getAllTemplateTypes();
    const templates = Object.values(componentTemplates);

    let responseText = `# Available Component Types\n\n`;
    
    templates.forEach((template) => {
      responseText += `## ${template.name} (\`${template.type}\`)\n\n`;
      responseText += `${template.description}\n\n`;
      
      if (template.variants.length > 0) {
        responseText += `**Variants:** ${template.variants.join(', ')}\n\n`;
      }
      
      if (template.examples.length > 0) {
        responseText += `**Examples:**\n`;
        template.examples.forEach(example => {
          responseText += `- \`${example}\`\n`;
        });
        responseText += '\n';
      }
    });

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  }

  private async handleGetComponentTemplate(args: any) {
    const { type, variant } = ComponentTemplateSchema.parse(args);
    const template = getTemplate(type);

    if (!template) {
      throw new Error(`Template not found for type: ${type}`);
    }

    let responseText = `# ${template.name} Template\n\n`;
    responseText += `**Type:** ${template.type}\n`;
    responseText += `**Description:** ${template.description}\n\n`;

    if (template.variants.length > 0) {
      responseText += `## Available Variants\n\n`;
      template.variants.forEach(v => {
        responseText += `- \`${v}\`${v === variant ? ' (selected)' : ''}\n`;
      });
      responseText += '\n';
    }

    responseText += `## Usage Examples\n\n`;
    template.examples.forEach((example, index) => {
      responseText += `### Example ${index + 1}\n\n\`\`\`tsx\n${example}\n\`\`\`\n\n`;
    });

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  }

  private async handleGenerateComponentExamples(args: any) {
    const { type, includeAdvanced } = args;
    const template = getTemplate(type);

    if (!template) {
      throw new Error(`Template not found for type: ${type}`);
    }

    let responseText = `# ${template.name} Examples\n\n`;

    // Basic examples
    responseText += `## Basic Usage\n\n`;
    template.examples.forEach((example, index) => {
      responseText += `### Example ${index + 1}\n\n\`\`\`tsx\n${example}\n\`\`\`\n\n`;
    });

    // Advanced examples if requested
    if (includeAdvanced) {
      responseText += `## Advanced Usage\n\n`;
      
      switch (type) {
        case 'button':
          responseText += `### With Custom Styling\n\n\`\`\`tsx\n<Button className="bg-gradient-to-r from-purple-500 to-pink-500">\n  Gradient Button\n</Button>\n\`\`\`\n\n`;
          responseText += `### With Icon\n\n\`\`\`tsx\n<Button variant="outline" size="icon">\n  <Icon className="h-4 w-4" />\n</Button>\n\`\`\`\n\n`;
          break;
        
        case 'card':
          responseText += `### Complex Card Layout\n\n\`\`\`tsx\n<Card className="w-[350px]">\n  <CardHeader>\n    <CardTitle>Create project</CardTitle>\n    <CardDescription>Deploy your new project in one-click.</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <form>\n      <div className="grid w-full items-center gap-4">\n        <Input placeholder="Project name" />\n      </div>\n    </form>\n  </CardContent>\n  <CardFooter className="flex justify-between">\n    <Button variant="outline">Cancel</Button>\n    <Button>Deploy</Button>\n  </CardFooter>\n</Card>\n\`\`\`\n\n`;
          break;
        
        case 'modal':
          responseText += `### Modal with Form\n\n\`\`\`tsx\n<Modal>\n  <ModalTrigger asChild>\n    <Button variant="outline">Edit Profile</Button>\n  </ModalTrigger>\n  <ModalContent className="sm:max-w-[425px]">\n    <ModalHeader>\n      <ModalTitle>Edit profile</ModalTitle>\n      <ModalDescription>\n        Make changes to your profile here. Click save when you're done.\n      </ModalDescription>\n    </ModalHeader>\n    <div className="grid gap-4 py-4">\n      <Input placeholder="Name" />\n      <Input placeholder="Email" />\n    </div>\n    <ModalFooter>\n      <Button type="submit">Save changes</Button>\n    </ModalFooter>\n  </ModalContent>\n</Modal>\n\`\`\`\n\n`;
          break;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Component Builder MCP server running on stdio');
  }
}

export { ComponentBuilderServer };

const server = new ComponentBuilderServer();
server.run().catch(console.error);