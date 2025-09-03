import { z } from 'zod';

// Component specification schema
export const ComponentSpecSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  type: z.enum([
    'button',
    'input',
    'card',
    'modal',
    'dropdown',
    'form',
    'navigation',
    'layout',
    'data-display',
    'feedback',
    'custom',
    // New component types
    'select',
    'checkbox',
    'radio',
    'textarea',
    'switch',
    'slider',
    'tabs',
    'accordion',
    'alert',
    'badge',
    'avatar',
    'breadcrumb',
    'pagination',
    'progress',
    'skeleton',
    'spinner',
    'tooltip',
    'popover',
    'dialog',
    'sheet',
    'toast',
    'table',
    'calendar',
    'date-picker',
    'command',
    'context-menu',
    'hover-card',
    'menubar',
    'navigation-menu',
    'scroll-area',
    'separator',
    'toggle',
    'toggle-group'
  ]),
  variant: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
  description: z.string().optional(),
  props: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().default(false),
    description: z.string().optional(),
    defaultValue: z.any().optional()
  })).default([]),
  styling: z.object({
    className: z.string().optional(),
    variant: z.string().optional(),
    colorScheme: z.enum(['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost']).default('default')
  }).optional(),
  accessibility: z.object({
    ariaLabel: z.string().optional(),
    role: z.string().optional(),
    tabIndex: z.number().optional()
  }).optional(),
  children: z.boolean().default(false),
  customContent: z.string().optional()
});

export const ComponentValidationSchema = z.object({
  componentCode: z.string().min(1, 'Component code is required'),
  strict: z.boolean().default(false)
});

export const ComponentTemplateSchema = z.object({
  type: z.string(),
  variant: z.string().optional()
});

export type ComponentSpec = z.infer<typeof ComponentSpecSchema>;
export type ComponentValidation = z.infer<typeof ComponentValidationSchema>;
export type ComponentTemplate = z.infer<typeof ComponentTemplateSchema>;

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export interface GeneratedComponent {
  name: string;
  code: string;
  imports: string[];
  dependencies: string[];
  documentation: string;
  examples: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ComponentTemplateData {
  name: string;
  type: string;
  template: string;
  variants: string[];
  description: string;
  examples: string[];
}