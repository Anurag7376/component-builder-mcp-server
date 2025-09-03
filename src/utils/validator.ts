import { ValidationResult } from '../types/component.js';

export class ComponentValidator {
  
  validateComponent(componentCode: string, strict: boolean = false): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic structure validation
    this.validateBasicStructure(componentCode, errors, warnings);
    
    // TypeScript validation
    this.validateTypeScript(componentCode, errors, warnings);
    
    // Shadcn standards validation
    this.validateShadcnStandards(componentCode, errors, warnings, suggestions);
    
    // Accessibility validation
    this.validateAccessibility(componentCode, warnings, suggestions);
    
    // Performance validation
    this.validatePerformance(componentCode, warnings, suggestions);
    
    // Strict mode additional validations
    if (strict) {
      this.validateStrictMode(componentCode, errors, warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateBasicStructure(code: string, errors: string[], warnings: string[]): void {
    // Check for React import
    if (!code.includes('import * as React from "react"') && !code.includes('import React from "react"')) {
      errors.push('Missing React import');
    }

    // Check for forwardRef usage
    if (!code.includes('React.forwardRef')) {
      warnings.push('Consider using React.forwardRef for better ref handling');
    }

    // Check for displayName
    if (!code.includes('.displayName =')) {
      warnings.push('Missing displayName property for better debugging');
    }

    // Check for export
    if (!code.includes('export')) {
      errors.push('Component must be exported');
    }

    // Check for proper component naming (PascalCase)
    const componentMatch = code.match(/const (\w+) = React\.forwardRef/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
        errors.push(`Component name "${componentName}" should be in PascalCase`);
      }
    }
  }

  private validateTypeScript(code: string, errors: string[], warnings: string[]): void {
    // Check for TypeScript interface
    if (!code.includes('interface') && !code.includes('type ')) {
      warnings.push('Consider adding TypeScript interface for props');
    }

    // Check for proper typing
    if (code.includes('any') && !code.includes('React.ComponentPropsWithoutRef')) {
      warnings.push('Avoid using "any" type, use specific types instead');
    }

    // Check for generic types
    if (code.includes('React.forwardRef') && !code.includes('<')) {
      warnings.push('Consider adding generic types to forwardRef for better type safety');
    }
  }

  private validateShadcnStandards(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    // Check for cn utility import
    if (code.includes('className') && !code.includes('import { cn } from "@/lib/utils"')) {
      errors.push('Missing cn utility import for className handling');
    }

    // Check for cn usage with className
    if (code.includes('className') && !code.includes('cn(')) {
      warnings.push('Consider using cn() utility for className composition');
    }

    // Check for Tailwind classes structure
    if (code.includes('className=') && !this.hasTailwindClasses(code)) {
      suggestions.push('Consider using Tailwind CSS classes for styling');
    }

    // Check for class-variance-authority usage for variants
    if (code.includes('variant') && !code.includes('cva')) {
      suggestions.push('Consider using class-variance-authority (cva) for variant handling');
    }

    // Check for Radix UI primitives for complex components
    if (this.isComplexComponent(code) && !code.includes('@radix-ui/')) {
      suggestions.push('Consider using Radix UI primitives for complex interactive components');
    }

    // Check for proper prop spreading
    if (!code.includes('...props')) {
      warnings.push('Consider spreading remaining props to the underlying element');
    }
  }

  private validateAccessibility(code: string, warnings: string[], suggestions: string[]): void {
    // Check for aria attributes when needed
    if (code.includes('button') && !code.includes('aria-')) {
      suggestions.push('Consider adding appropriate ARIA attributes for better accessibility');
    }

    // Check for semantic HTML
    if (code.includes('div') && code.includes('onClick')) {
      warnings.push('Consider using semantic HTML elements (button, a) instead of div for interactive elements');
    }

    // Check for keyboard navigation
    if (code.includes('onClick') && !code.includes('onKeyDown')) {
      suggestions.push('Consider adding keyboard event handlers for better accessibility');
    }

    // Check for focus management
    if (code.includes('focus') && !code.includes('focus-visible:')) {
      suggestions.push('Consider adding focus-visible styles for keyboard navigation');
    }
  }

  private validatePerformance(code: string, warnings: string[], suggestions: string[]): void {
    // Check for unnecessary re-renders
    if (code.includes('useMemo') || code.includes('useCallback')) {
      suggestions.push('Ensure useMemo and useCallback are used appropriately to avoid unnecessary optimizations');
    }

    // Check for inline functions in render
    const inlineFunctionRegex = /\{[^}]*=>[^}]*\}/g;
    const matches = code.match(inlineFunctionRegex);
    if (matches && matches.length > 2) {
      warnings.push('Consider extracting inline functions to avoid re-creation on each render');
    }

    // Check for large component size
    const lineCount = code.split('\n').length;
    if (lineCount > 200) {
      suggestions.push('Consider breaking down large components into smaller, reusable components');
    }
  }

  private validateStrictMode(code: string, errors: string[], warnings: string[]): void {
    // Strict mode: require all accessibility attributes
    if (!code.includes('aria-label') && !code.includes('aria-labelledby')) {
      errors.push('Strict mode: Missing accessibility labels');
    }

    // Strict mode: require proper TypeScript generics
    if (!code.includes('<') && code.includes('React.forwardRef')) {
      errors.push('Strict mode: Missing TypeScript generics for forwardRef');
    }

    // Strict mode: require documentation comments
    if (!code.includes('/**') && !code.includes('//')) {
      errors.push('Strict mode: Missing documentation comments');
    }
  }

  private hasTailwindClasses(code: string): boolean {
    const tailwindPatterns = [
      /\b(bg-|text-|border-|rounded-|p-|m-|w-|h-|flex|grid|absolute|relative)\w*/g,
      /\b(hover:|focus:|active:|disabled:)\w*/g,
      /\b(sm:|md:|lg:|xl:|2xl:)\w*/g
    ];

    return tailwindPatterns.some(pattern => pattern.test(code));
  }

  private isComplexComponent(code: string): boolean {
    const complexityIndicators = [
      'state',
      'useEffect',
      'useState',
      'useCallback',
      'useMemo',
      'Portal',
      'Dialog',
      'Dropdown',
      'Popover',
      'Tooltip'
    ];

    return complexityIndicators.some(indicator => code.includes(indicator));
  }

  // Validate component against specific Shadcn patterns
  validateShadcnPattern(code: string, componentType: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    switch (componentType.toLowerCase()) {
      case 'button':
        this.validateButtonPattern(code, errors, warnings, suggestions);
        break;
      case 'input':
        this.validateInputPattern(code, errors, warnings, suggestions);
        break;
      case 'card':
        this.validateCardPattern(code, errors, warnings, suggestions);
        break;
      case 'modal':
      case 'dialog':
        this.validateModalPattern(code, errors, warnings, suggestions);
        break;
      case 'select':
        this.validateSelectPattern(code, errors, warnings, suggestions);
        break;
      case 'checkbox':
        this.validateCheckboxPattern(code, errors, warnings, suggestions);
        break;
      case 'radio':
        this.validateRadioPattern(code, errors, warnings, suggestions);
        break;
      case 'textarea':
        this.validateTextareaPattern(code, errors, warnings, suggestions);
        break;
      case 'switch':
        this.validateSwitchPattern(code, errors, warnings, suggestions);
        break;
      case 'tabs':
        this.validateTabsPattern(code, errors, warnings, suggestions);
        break;
      case 'badge':
        this.validateBadgePattern(code, errors, warnings, suggestions);
        break;
      case 'avatar':
        this.validateAvatarPattern(code, errors, warnings, suggestions);
        break;
      case 'alert':
        this.validateAlertPattern(code, errors, warnings, suggestions);
        break;
      case 'progress':
        this.validateProgressPattern(code, errors, warnings, suggestions);
        break;
      case 'skeleton':
        this.validateSkeletonPattern(code, errors, warnings, suggestions);
        break;
      default:
        warnings.push(`Unknown component type: ${componentType}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateButtonPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('buttonVariants') && !code.includes('cva')) {
      errors.push('Button should use class-variance-authority for variant handling');
    }

    if (!code.includes('Slot')) {
      warnings.push('Button should support asChild prop with Slot component');
    }

    if (!code.includes('disabled:')) {
      warnings.push('Button should include disabled state styles');
    }
  }

  private validateInputPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('HTMLInputElement')) {
      errors.push('Input should properly type the ref as HTMLInputElement');
    }

    if (!code.includes('placeholder:')) {
      suggestions.push('Consider adding placeholder styles');
    }

    if (!code.includes('disabled:')) {
      warnings.push('Input should include disabled state styles');
    }
  }

  private validateCardPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    const requiredSubComponents = ['CardHeader', 'CardContent', 'CardFooter'];
    const missingComponents = requiredSubComponents.filter(comp => !code.includes(comp));
    
    if (missingComponents.length > 0) {
      suggestions.push(`Consider adding missing card components: ${missingComponents.join(', ')}`);
    }

    if (!code.includes('bg-card')) {
      warnings.push('Card should use semantic color tokens (bg-card, text-card-foreground)');
    }
  }

  private validateModalPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-dialog')) {
      errors.push('Modal should use Radix UI Dialog primitive');
    }

    if (!code.includes('Portal')) {
      errors.push('Modal should use Portal for proper rendering');
    }

    if (!code.includes('Overlay')) {
      warnings.push('Modal should include overlay component');
    }

    if (!code.includes('Close')) {
      warnings.push('Modal should include close button');
    }

    if (!code.includes('aria-')) {
      warnings.push('Modal should include proper ARIA attributes');
    }
  }

  private validateSelectPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-select')) {
      errors.push('Select should use Radix UI Select primitive');
    }

    if (!code.includes('SelectTrigger')) {
      warnings.push('Select should include SelectTrigger component');
    }

    if (!code.includes('SelectContent')) {
      warnings.push('Select should include SelectContent component');
    }

    if (!code.includes('SelectItem')) {
      warnings.push('Select should include SelectItem component');
    }
  }

  private validateCheckboxPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-checkbox')) {
      errors.push('Checkbox should use Radix UI Checkbox primitive');
    }

    if (!code.includes('CheckboxPrimitive.Indicator')) {
      warnings.push('Checkbox should include proper indicator');
    }

    if (!code.includes('Check')) {
      suggestions.push('Consider using Check icon from lucide-react');
    }
  }

  private validateRadioPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-radio-group')) {
      errors.push('Radio should use Radix UI RadioGroup primitive');
    }

    if (!code.includes('RadioGroupPrimitive.Item')) {
      warnings.push('Radio should include RadioGroupItem components');
    }

    if (!code.includes('RadioGroupPrimitive.Indicator')) {
      warnings.push('Radio should include proper indicator');
    }
  }

  private validateTextareaPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('HTMLTextAreaElement')) {
      errors.push('Textarea should properly type the ref as HTMLTextAreaElement');
    }

    if (!code.includes('min-h-')) {
      suggestions.push('Consider adding minimum height for textarea');
    }

    if (!code.includes('resize')) {
      suggestions.push('Consider controlling textarea resize behavior');
    }
  }

  private validateSwitchPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-switch')) {
      errors.push('Switch should use Radix UI Switch primitive');
    }

    if (!code.includes('SwitchPrimitives.Thumb')) {
      warnings.push('Switch should include thumb component');
    }

    if (!code.includes('data-[state=checked]')) {
      suggestions.push('Consider adding state-based styling');
    }
  }

  private validateTabsPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-tabs')) {
      errors.push('Tabs should use Radix UI Tabs primitive');
    }

    const requiredSubComponents = ['TabsList', 'TabsTrigger', 'TabsContent'];
    const missingComponents = requiredSubComponents.filter(comp => !code.includes(comp));
    
    if (missingComponents.length > 0) {
      warnings.push(`Tabs should include: ${missingComponents.join(', ')}`);
    }
  }

  private validateBadgePattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('cva')) {
      suggestions.push('Consider using class-variance-authority for badge variants');
    }

    if (!code.includes('variant')) {
      suggestions.push('Consider adding variant support for different badge types');
    }

    if (!code.includes('rounded-full')) {
      suggestions.push('Consider using rounded-full for badge styling');
    }
  }

  private validateAvatarPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('@radix-ui/react-avatar')) {
      errors.push('Avatar should use Radix UI Avatar primitive');
    }

    if (!code.includes('AvatarImage')) {
      warnings.push('Avatar should include AvatarImage component');
    }

    if (!code.includes('AvatarFallback')) {
      warnings.push('Avatar should include AvatarFallback component');
    }

    if (!code.includes('rounded-full')) {
      suggestions.push('Avatar should be circular with rounded-full');
    }
  }

  private validateAlertPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('role="alert"')) {
      errors.push('Alert should include role="alert" for accessibility');
    }

    if (!code.includes('variant')) {
      suggestions.push('Consider adding variant support for different alert types');
    }

    if (!code.includes('destructive')) {
      suggestions.push('Consider adding destructive variant for error alerts');
    }
  }

  private validateProgressPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('value')) {
      warnings.push('Progress should accept value prop');
    }

    if (!code.includes('max')) {
      suggestions.push('Consider adding max prop for progress range');
    }

    if (!code.includes('translateX')) {
      suggestions.push('Consider using transform for smooth progress animation');
    }
  }

  private validateSkeletonPattern(code: string, errors: string[], warnings: string[], suggestions: string[]): void {
    if (!code.includes('animate-pulse')) {
      errors.push('Skeleton should include animate-pulse for loading animation');
    }

    if (!code.includes('bg-muted')) {
      suggestions.push('Consider using bg-muted for skeleton background');
    }

    if (!code.includes('rounded')) {
      suggestions.push('Consider adding rounded corners to skeleton');
    }
  }
}