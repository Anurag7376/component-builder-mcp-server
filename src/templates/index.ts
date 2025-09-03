import { ComponentTemplateData } from '../types/component.js';

export const componentTemplates: Record<string, ComponentTemplateData> = {
  button: {
    name: 'Button',
    type: 'button',
    template: 'button.hbs',
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    description: 'Interactive button component with multiple variants and sizes',
    examples: [
      '<Button>Click me</Button>',
      '<Button variant="outline" size="lg">Large Outline</Button>',
      '<Button variant="destructive">Delete</Button>'
    ]
  },
  input: {
    name: 'Input',
    type: 'input',
    template: 'input.hbs',
    variants: ['default'],
    description: 'Form input component with proper styling and accessibility',
    examples: [
      '<Input type="text" placeholder="Enter text..." />',
      '<Input type="email" placeholder="Email" />',
      '<Input type="password" placeholder="Password" />'
    ]
  },
  card: {
    name: 'Card',
    type: 'card',
    template: 'card.hbs',
    variants: ['default'],
    description: 'Flexible card component with header, content, and footer sections',
    examples: [
      '<Card><CardContent>Simple card</CardContent></Card>',
      '<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Content here</CardContent></Card>'
    ]
  },
  modal: {
    name: 'Modal',
    type: 'modal',
    template: 'modal.hbs',
    variants: ['default'],
    description: 'Modal dialog component built with Radix UI primitives',
    examples: [
      '<Modal><ModalTrigger>Open</ModalTrigger><ModalContent>Content</ModalContent></Modal>'
    ]
  },
  select: {
    name: 'Select',
    type: 'select',
    template: 'select.hbs',
    variants: ['default'],
    description: 'Select dropdown component with searchable options',
    examples: [
      '<Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="option1">Option 1</SelectItem></SelectContent></Select>'
    ]
  },
  checkbox: {
    name: 'Checkbox',
    type: 'checkbox',
    template: 'checkbox.hbs',
    variants: ['default'],
    description: 'Checkbox input component with proper accessibility',
    examples: [
      '<Checkbox id="terms" />',
      '<Checkbox checked disabled />'
    ]
  },
  radio: {
    name: 'RadioGroup',
    type: 'radio',
    template: 'radio.hbs',
    variants: ['default'],
    description: 'Radio button group component for single selection',
    examples: [
      '<RadioGroup><RadioGroupItem value="option1" /><RadioGroupItem value="option2" /></RadioGroup>'
    ]
  },
  textarea: {
    name: 'Textarea',
    type: 'textarea',
    template: 'textarea.hbs',
    variants: ['default'],
    description: 'Multi-line text input component',
    examples: [
      '<Textarea placeholder="Enter your message..." />',
      '<Textarea rows={4} />'
    ]
  },
  switch: {
    name: 'Switch',
    type: 'switch',
    template: 'switch.hbs',
    variants: ['default'],
    description: 'Toggle switch component for boolean values',
    examples: [
      '<Switch />',
      '<Switch checked />',
      '<Switch disabled />'
    ]
  },
  tabs: {
    name: 'Tabs',
    type: 'tabs',
    template: 'tabs.hbs',
    variants: ['default'],
    description: 'Tabs component for organizing content in panels',
    examples: [
      '<Tabs><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList><TabsContent value="tab1">Content</TabsContent></Tabs>'
    ]
  },
  badge: {
    name: 'Badge',
    type: 'badge',
    template: 'badge.hbs',
    variants: ['default', 'secondary', 'destructive', 'outline'],
    description: 'Badge component for displaying status or labels',
    examples: [
      '<Badge>New</Badge>',
      '<Badge variant="secondary">Beta</Badge>',
      '<Badge variant="destructive">Error</Badge>'
    ]
  },
  avatar: {
    name: 'Avatar',
    type: 'avatar',
    template: 'avatar.hbs',
    variants: ['default'],
    description: 'Avatar component for displaying user profile images',
    examples: [
      '<Avatar><AvatarImage src="/avatar.jpg" /><AvatarFallback>CN</AvatarFallback></Avatar>'
    ]
  },
  alert: {
    name: 'Alert',
    type: 'alert',
    template: 'alert.hbs',
    variants: ['default', 'destructive'],
    description: 'Alert component for displaying important messages',
    examples: [
      '<Alert><AlertDescription>This is an alert message.</AlertDescription></Alert>',
      '<Alert variant="destructive"><AlertDescription>Error occurred!</AlertDescription></Alert>'
    ]
  },
  progress: {
    name: 'Progress',
    type: 'progress',
    template: 'progress.hbs',
    variants: ['default'],
    description: 'Progress bar component for showing completion status',
    examples: [
      '<Progress value={50} />',
      '<Progress value={75} max={100} />'
    ]
  },
  skeleton: {
    name: 'Skeleton',
    type: 'skeleton',
    template: 'skeleton.hbs',
    variants: ['default'],
    description: 'Skeleton loading component for placeholder content',
    examples: [
      '<Skeleton className="w-[100px] h-[20px] rounded-full" />',
      '<Skeleton className="h-4 w-[250px]" />'
    ]
  }
};

export function getTemplate(type: string): ComponentTemplateData | undefined {
  return componentTemplates[type.toLowerCase()];
}

export function getAllTemplateTypes(): string[] {
  return Object.keys(componentTemplates);
}

export function getTemplatesByCategory(category: string): ComponentTemplateData[] {
  // This could be extended to categorize templates
  return Object.values(componentTemplates);
}