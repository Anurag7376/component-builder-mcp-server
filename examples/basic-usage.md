# Basic Usage Examples

This document provides basic usage examples for the Component Builder MCP Server.

## 1. Generate a Simple Button Component

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "CustomButton",
  "type": "button",
  "description": "A custom button component with primary styling",
  "children": true
}
```

**Expected Output:**

- A fully functional React button component
- TypeScript interfaces
- Proper Shadcn/UI styling
- Documentation and usage examples

## 2. Generate an Input Component with Custom Props

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "EmailInput",
  "type": "input",
  "description": "Email input component with validation",
  "props": [
    {
      "name": "placeholder",
      "type": "string",
      "required": false,
      "description": "Input placeholder text",
      "defaultValue": "Enter your email"
    },
    {
      "name": "onValidate",
      "type": "(email: string) => boolean",
      "required": false,
      "description": "Email validation function"
    }
  ],
  "accessibility": {
    "ariaLabel": "Email address input",
    "role": "textbox"
  }
}
```

## 3. Generate a Card Component

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "ProductCard",
  "type": "card",
  "description": "Product display card with image and details",
  "size": "lg",
  "props": [
    {
      "name": "title",
      "type": "string",
      "required": true,
      "description": "Product title"
    },
    {
      "name": "price",
      "type": "number",
      "required": true,
      "description": "Product price"
    },
    {
      "name": "imageUrl",
      "type": "string",
      "required": false,
      "description": "Product image URL"
    }
  ],
  "children": true
}
```

## 4. Validate Component Code

**Tool:** `validate_component`

**Input:**

```json
{
  "componentCode": "import * as React from 'react';\n\nconst Button = () => {\n  return <button>Click me</button>;\n};\n\nexport { Button };",
  "strict": false
}
```

**Expected Output:**

- Validation results with errors, warnings, and suggestions
- Specific feedback about Shadcn/UI standards compliance

## 5. List Available Component Types

**Tool:** `list_component_types`

**Input:**

```json
{}
```

**Expected Output:**

- List of all available component types
- Description and variants for each type
- Example usage for each component

## 6. Get Component Template Details

**Tool:** `get_component_template`

**Input:**

```json
{
  "type": "button",
  "variant": "outline"
}
```

**Expected Output:**

- Detailed template information
- Available variants
- Usage examples specific to the template

## 7. Generate Component Examples

**Tool:** `generate_component_examples`

**Input:**

```json
{
  "type": "modal",
  "includeAdvanced": true
}
```

**Expected Output:**

- Basic and advanced usage examples
- Different configuration options
- Real-world use cases
