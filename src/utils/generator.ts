import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ComponentSpec, GeneratedComponent } from '../types/component.js';
import { getTemplate } from '../templates/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register Handlebars helpers
Handlebars.registerHelper('capitalizeFirst', function(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('camelCase', function(str: string) {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
});

Handlebars.registerHelper('kebabCase', function(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
});

Handlebars.registerHelper('eq', function(a: any, b: any) {
  return a === b;
});

export class ComponentGenerator {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  async generateComponent(spec: ComponentSpec): Promise<GeneratedComponent> {
    const template = getTemplate(spec.type);
    if (!template) {
      throw new Error(`Unknown component type: ${spec.type}`);
    }

    const compiledTemplate = await this.getCompiledTemplate(template.template);
    
    // Prepare template data
    const templateData = this.prepareTemplateData(spec);
    
    // Generate component code
    const code = compiledTemplate(templateData);
    
    // Generate imports based on component type
    const imports = this.generateImports(spec);
    
    // Generate dependencies
    const dependencies = this.generateDependencies(spec);
    
    // Generate documentation
    const documentation = this.generateDocumentation(spec);
    
    // Generate examples
    const examples = this.generateExamples(spec);

    return {
      name: spec.name,
      code,
      imports,
      dependencies,
      documentation,
      examples
    };
  }

  private async getCompiledTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = join(__dirname, '..', 'templates', templateName);
    const templateContent = await readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(templateContent);
    
    this.templateCache.set(templateName, compiled);
    return compiled;
  }

  private prepareTemplateData(spec: ComponentSpec): any {
    const capitalizedName = spec.name.charAt(0).toUpperCase() + spec.name.slice(1);
    const camelCaseName = spec.name.charAt(0).toLowerCase() + spec.name.slice(1);

    return {
      ComponentName: capitalizedName,
      componentName: camelCaseName,
      type: spec.type,
      variant: spec.variant,
      size: spec.size,
      description: spec.description,
      props: spec.props || [],
      styling: spec.styling || {},
      accessibility: spec.accessibility || {},
      children: spec.children,
      customContent: spec.customContent
    };
  }

  private generateImports(spec: ComponentSpec): string[] {
    const imports = ['import * as React from "react"'];
    
    // Add common imports
    imports.push('import { cn } from "@/lib/utils"');
    
    // Add specific imports based on component type
    switch (spec.type) {
      case 'button':
        imports.push('import { Slot } from "@radix-ui/react-slot"');
        imports.push('import { cva, type VariantProps } from "class-variance-authority"');
        break;
      case 'modal':
        imports.push('import * as DialogPrimitive from "@radix-ui/react-dialog"');
        imports.push('import { X } from "lucide-react"');
        break;
      case 'dropdown':
        imports.push('import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"');
        break;
    }

    return imports;
  }

  private generateDependencies(spec: ComponentSpec): string[] {
    const dependencies = ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'];
    
    switch (spec.type) {
      case 'modal':
      case 'dialog':
        dependencies.push('@radix-ui/react-dialog');
        break;
      case 'dropdown':
        dependencies.push('@radix-ui/react-dropdown-menu');
        break;
      case 'select':
        dependencies.push('@radix-ui/react-select');
        break;
      case 'checkbox':
        dependencies.push('@radix-ui/react-checkbox');
        break;
      case 'radio':
        dependencies.push('@radix-ui/react-radio-group');
        break;
      case 'switch':
        dependencies.push('@radix-ui/react-switch');
        break;
      case 'tabs':
        dependencies.push('@radix-ui/react-tabs');
        break;
      case 'accordion':
        dependencies.push('@radix-ui/react-accordion');
        break;
      case 'avatar':
        dependencies.push('@radix-ui/react-avatar');
        break;
      case 'popover':
        dependencies.push('@radix-ui/react-popover');
        break;
      case 'tooltip':
        dependencies.push('@radix-ui/react-tooltip');
        break;
      case 'hover-card':
        dependencies.push('@radix-ui/react-hover-card');
        break;
      case 'context-menu':
        dependencies.push('@radix-ui/react-context-menu');
        break;
      case 'menubar':
        dependencies.push('@radix-ui/react-menubar');
        break;
      case 'navigation-menu':
        dependencies.push('@radix-ui/react-navigation-menu');
        break;
      case 'scroll-area':
        dependencies.push('@radix-ui/react-scroll-area');
        break;
      case 'separator':
        dependencies.push('@radix-ui/react-separator');
        break;
      case 'slider':
        dependencies.push('@radix-ui/react-slider');
        break;
      case 'toggle':
      case 'toggle-group':
        dependencies.push('@radix-ui/react-toggle');
        dependencies.push('@radix-ui/react-toggle-group');
        break;
    }

    // Add lucide-react for icons (most components need icons)
    if (!['input', 'textarea', 'progress', 'skeleton'].includes(spec.type)) {
      dependencies.push('lucide-react');
    }

    return [...new Set(dependencies)];
  }

  private generateDocumentation(spec: ComponentSpec): string {
    const capitalizedName = spec.name.charAt(0).toUpperCase() + spec.name.slice(1);
    
    let doc = `# ${capitalizedName}\n\n`;
    
    if (spec.description) {
      doc += `${spec.description}\n\n`;
    }
    
    doc += `## Usage\n\n`;
    doc += `\`\`\`tsx\nimport { ${capitalizedName} } from "@/components/ui/${spec.name.toLowerCase()}"\n\n`;
    doc += `<${capitalizedName}`;
    
    if (spec.props && spec.props.length > 0) {
      const requiredProps = spec.props.filter(p => p.required);
      if (requiredProps.length > 0) {
        doc += ` ${requiredProps.map(p => `${p.name}={${p.defaultValue || `"${p.type}"`}}`).join(' ')}`;
      }
    }
    
    if (spec.children) {
      doc += `>\n  Content here\n</${capitalizedName}>`;
    } else {
      doc += ` />`;
    }
    
    doc += `\n\`\`\`\n\n`;
    
    if (spec.props && spec.props.length > 0) {
      doc += `## Props\n\n`;
      doc += `| Prop | Type | Required | Description | Default |\n`;
      doc += `|------|------|----------|-------------|----------|\n`;
      
      spec.props.forEach(prop => {
        doc += `| ${prop.name} | \`${prop.type}\` | ${prop.required ? 'Yes' : 'No'} | ${prop.description || '-'} | ${prop.defaultValue ? `\`${prop.defaultValue}\`` : '-'} |\n`;
      });
    }
    
    return doc;
  }

  private generateExamples(spec: ComponentSpec): string[] {
    const capitalizedName = spec.name.charAt(0).toUpperCase() + spec.name.slice(1);
    const examples = [];
    
    // Basic example
    if (spec.children) {
      examples.push(`<${capitalizedName}>Basic ${spec.type}</${capitalizedName}>`);
    } else {
      examples.push(`<${capitalizedName} />`);
    }
    
    // Type-specific examples
    switch (spec.type) {
      case 'button':
        examples.push(`<${capitalizedName} variant="outline">Outline Button</${capitalizedName}>`);
        examples.push(`<${capitalizedName} variant="destructive" size="lg">Large Destructive</${capitalizedName}>`);
        break;
      case 'select':
        examples.push(`<${capitalizedName}><${capitalizedName}Trigger><${capitalizedName}Value /></${capitalizedName}Trigger><${capitalizedName}Content><${capitalizedName}Item value="option1">Option 1</${capitalizedName}Item></${capitalizedName}Content></${capitalizedName}>`);
        break;
      case 'checkbox':
        examples.push(`<${capitalizedName} id="terms" />`);
        examples.push(`<${capitalizedName} checked disabled />`);
        break;
      case 'radio':
        examples.push(`<${capitalizedName}><${capitalizedName}Item value="option1" /><${capitalizedName}Item value="option2" /></${capitalizedName}>`);
        break;
      case 'textarea':
        examples.push(`<${capitalizedName} placeholder="Enter your message..." />`);
        examples.push(`<${capitalizedName} rows={4} />`);
        break;
      case 'switch':
        examples.push(`<${capitalizedName} checked />`);
        examples.push(`<${capitalizedName} disabled />`);
        break;
      case 'tabs':
        examples.push(`<${capitalizedName}><${capitalizedName}List><${capitalizedName}Trigger value="tab1">Tab 1</${capitalizedName}Trigger></${capitalizedName}List><${capitalizedName}Content value="tab1">Content</${capitalizedName}Content></${capitalizedName}>`);
        break;
      case 'badge':
        examples.push(`<${capitalizedName} variant="secondary">Beta</${capitalizedName}>`);
        examples.push(`<${capitalizedName} variant="destructive">Error</${capitalizedName}>`);
        break;
      case 'avatar':
        examples.push(`<${capitalizedName}><${capitalizedName}Image src="/avatar.jpg" /><${capitalizedName}Fallback>CN</${capitalizedName}Fallback></${capitalizedName}>`);
        break;
      case 'alert':
        examples.push(`<${capitalizedName} variant="destructive"><${capitalizedName}Description>Error occurred!</${capitalizedName}Description></${capitalizedName}>`);
        break;
      case 'progress':
        examples.push(`<${capitalizedName} value={75} />`);
        examples.push(`<${capitalizedName} value={50} max={100} />`);
        break;
      case 'skeleton':
        examples.push(`<${capitalizedName} className="w-[100px] h-[20px] rounded-full" />`);
        examples.push(`<${capitalizedName} className="h-4 w-[250px]" />`);
        break;
    }
    
    // Size examples
    if (spec.size && ['button', 'input', 'textarea'].includes(spec.type)) {
      examples.push(`<${capitalizedName} size="sm">Small</${capitalizedName}>`);
      examples.push(`<${capitalizedName} size="lg">Large</${capitalizedName}>`);
    }
    
    // Custom props examples
    if (spec.props && spec.props.length > 0) {
      const propsExample = spec.props
        .filter(p => p.defaultValue)
        .map(p => `${p.name}={${JSON.stringify(p.defaultValue)}}`)
        .join(' ');
      
      if (propsExample) {
        if (spec.children) {
          examples.push(`<${capitalizedName} ${propsExample}>With Props</${capitalizedName}>`);
        } else {
          examples.push(`<${capitalizedName} ${propsExample} />`);
        }
      }
    }
    
    return examples;
  }
}