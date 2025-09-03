# API Reference

## Tools

### generate_component

Generates a custom React component based on Shadcn UI standards.

**Parameters:**

| Parameter     | Type    | Required | Description                                                                                                                          |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| name          | string  | Yes      | Component name (PascalCase recommended)                                                                                              |
| type          | enum    | Yes      | Component type: 'button', 'input', 'card', 'modal', 'dropdown', 'form', 'navigation', 'layout', 'data-display', 'feedback', 'custom' |
| variant       | string  | No       | Component variant                                                                                                                    |
| size          | enum    | No       | Component size: 'sm', 'md', 'lg', 'xl' (default: 'md')                                                                               |
| description   | string  | No       | Component description for documentation                                                                                              |
| props         | array   | No       | Component props definition                                                                                                           |
| styling       | object  | No       | Styling configuration                                                                                                                |
| accessibility | object  | No       | Accessibility configuration                                                                                                          |
| children      | boolean | No       | Whether component accepts children (default: false)                                                                                  |
| customContent | string  | No       | Custom JSX content for the component                                                                                                 |

**Props Object Structure:**

```typescript
{
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: any;
}
```

**Styling Object Structure:**

```typescript
{
  className?: string;
  variant?: string;
  colorScheme?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
}
```

**Accessibility Object Structure:**

```typescript
{
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
}
```

**Returns:**

- Generated component code
- Import statements
- Dependencies list
- Documentation
- Usage examples

### validate_component

Validates a React component against Shadcn UI standards.

**Parameters:**

| Parameter     | Type    | Required | Description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| componentCode | string  | Yes      | The React component code to validate           |
| strict        | boolean | No       | Enable strict validation mode (default: false) |

**Returns:**

- `isValid`: Boolean indicating if component is valid
- `errors`: Array of validation errors
- `warnings`: Array of validation warnings
- `suggestions`: Array of improvement suggestions

### list_component_types

Lists all available component types and their templates.

**Parameters:** None

**Returns:**

- List of component types
- Template descriptions
- Available variants
- Usage examples

### get_component_template

Gets detailed information about a specific component template.

**Parameters:**

| Parameter | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| type      | string | Yes      | Component type to get template for |
| variant   | string | No       | Component variant                  |

**Returns:**

- Template details
- Available variants
- Usage examples
- Configuration options

### generate_component_examples

Generates usage examples for a component type.

**Parameters:**

| Parameter       | Type    | Required | Description                                      |
| --------------- | ------- | -------- | ------------------------------------------------ |
| type            | string  | Yes      | Component type to generate examples for          |
| includeAdvanced | boolean | No       | Include advanced usage examples (default: false) |

**Returns:**

- Basic usage examples
- Advanced examples (if requested)
- Configuration variations

## Component Types

### button

Interactive button component with multiple variants and sizes.

**Variants:** default, destructive, outline, secondary, ghost, link
**Features:**

- Class variance authority integration
- asChild prop support
- Disabled states
- Focus management

### input

Form input component with proper styling and accessibility.

**Features:**

- TypeScript typing for HTML input attributes
- Placeholder styling
- Disabled states
- Focus-visible styles

### card

Flexible card component with header, content, and footer sections.

**Sub-components:** CardHeader, CardTitle, CardDescription, CardContent, CardFooter
**Features:**

- Semantic color tokens
- Flexible layout
- Shadow and border styling

### modal

Modal dialog component built with Radix UI primitives.

**Sub-components:** ModalTrigger, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription
**Features:**

- Portal rendering
- Overlay backdrop
- Focus management
- ESC key handling
- Animation support

### dropdown

Dropdown menu component with keyboard navigation.

**Features:**

- Radix UI primitives
- Keyboard navigation
- Focus management
- Positioning

### form

Form components with validation support.

**Features:**

- Field validation
- Error handling
- Accessibility labels
- Form state management

### navigation

Navigation components for menus and breadcrumbs.

**Features:**

- Keyboard navigation
- ARIA navigation patterns
- Active state management

### layout

Layout components for page structure.

**Features:**

- Responsive design
- Grid and flexbox layouts
- Container components

### data-display

Components for displaying data like tables and lists.

**Features:**

- Sorting capabilities
- Pagination
- Filtering
- Accessibility

### feedback

Components for user feedback like alerts and notifications.

**Features:**

- Auto-dismiss
- Animation support
- Type-based styling
- Accessibility

### custom

Flexible component type for custom implementations.

**Features:**

- Custom template support
- Flexible prop definitions
- Advanced customization

## Validation Rules

### Basic Structure

- React import required
- Component export required
- PascalCase naming
- forwardRef usage recommended
- displayName property recommended

### TypeScript

- Proper interface definitions
- Generic type usage
- Avoid 'any' types
- Proper ref typing

### Shadcn Standards

- cn utility for className composition
- Tailwind CSS classes
- Radix UI primitives for complex components
- Proper prop spreading
- Class variance authority for variants

### Accessibility

- ARIA attributes where needed
- Semantic HTML elements
- Keyboard navigation support
- Focus management

### Performance

- Avoid inline functions in render
- Proper memoization usage
- Component size considerations

## Error Codes

- `MISSING_REACT_IMPORT`: React import is missing
- `INVALID_COMPONENT_NAME`: Component name doesn't follow PascalCase
- `MISSING_EXPORT`: Component is not exported
- `MISSING_CN_IMPORT`: cn utility import is missing
- `INVALID_PROPS_TYPE`: Props interface is malformed
- `ACCESSIBILITY_VIOLATION`: Missing accessibility attributes
- `PERFORMANCE_ISSUE`: Performance optimization needed
