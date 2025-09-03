import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatComponentName(name: string): string {
  // Convert to PascalCase
  return name
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^[a-z]/, c => c.toUpperCase());
}

export function formatFileName(name: string): string {
  // Convert to kebab-case
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function validateComponentName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Component name cannot be empty' };
  }

  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name.replace(/[-_\s]/g, ''))) {
    return { isValid: false, error: 'Component name must contain only letters and numbers' };
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Component name is too long (max 50 characters)' };
  }

  // Check for reserved words
  const reservedWords = [
    'React', 'Component', 'Element', 'Fragment', 'useState', 'useEffect',
    'div', 'span', 'button', 'input', 'form', 'table', 'body', 'head', 'html'
  ];

  const formattedName = formatComponentName(name);
  if (reservedWords.includes(formattedName)) {
    return { isValid: false, error: `"${formattedName}" is a reserved word` };
  }

  return { isValid: true };
}

export function generateImportStatement(componentName: string, filePath: string): string {
  return `import { ${componentName} } from "${filePath}";`;
}

export function extractPropsFromCode(code: string): Array<{ name: string; type: string; required: boolean }> {
  const props: Array<{ name: string; type: string; required: boolean }> = [];
  
  // Match interface definition
  const interfaceMatch = code.match(/interface\s+\w+Props[^{]*\{([^}]+)\}/s);
  if (interfaceMatch) {
    const propsText = interfaceMatch[1];
    const propLines = propsText.split('\n').filter(line => line.trim());
    
    propLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        const match = trimmed.match(/(\w+)(\?)?:\s*([^;,]+)/);
        if (match) {
          props.push({
            name: match[1],
            type: match[3].trim(),
            required: !match[2] // ! means required if no ?
          });
        }
      }
    });
  }
  
  return props;
}

export function isPascalCase(str: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

export function isCamelCase(str: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
}

export function isKebabCase(str: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(str);
}

export function sanitizeClassName(className: string): string {
  // Remove potentially dangerous classes and ensure Tailwind format
  return className
    .split(' ')
    .filter(cls => {
      // Basic validation for Tailwind classes
      return /^[a-zA-Z0-9:\-\[\]\/\._%]+$/.test(cls) && 
             !cls.includes('javascript:') && 
             !cls.includes('expression(');
    })
    .join(' ');
}

export function generateComponentId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTypeScriptType(type: string): string {
  // Basic type formatting and validation
  const validTypes = [
    'string', 'number', 'boolean', 'object', 'array', 'function',
    'React.ReactNode', 'React.CSSProperties', 'React.MouseEvent',
    'React.KeyboardEvent', 'React.ChangeEvent', 'React.FormEvent'
  ];

  // Check if it's a basic type or React type
  if (validTypes.some(validType => type.includes(validType))) {
    return type;
  }

  // Default to string for unknown types
  console.warn(`Unknown type "${type}", defaulting to string`);
  return 'string';
}