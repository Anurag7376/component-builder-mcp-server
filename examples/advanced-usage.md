# Advanced Examples

This document provides advanced usage examples for the Component Builder MCP Server.

## 1. Custom Component with Complex Props

**Scenario:** Create a data table component with sorting, filtering, and pagination.

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "DataTable",
  "type": "custom",
  "description": "Advanced data table with sorting and filtering capabilities",
  "size": "lg",
  "props": [
    {
      "name": "data",
      "type": "Array<Record<string, any>>",
      "required": true,
      "description": "Table data array"
    },
    {
      "name": "columns",
      "type": "Array<{ key: string; label: string; sortable?: boolean }>",
      "required": true,
      "description": "Column definitions"
    },
    {
      "name": "onSort",
      "type": "(key: string, direction: 'asc' | 'desc') => void",
      "required": false,
      "description": "Sort handler function"
    },
    {
      "name": "onFilter",
      "type": "(filters: Record<string, any>) => void",
      "required": false,
      "description": "Filter handler function"
    },
    {
      "name": "pagination",
      "type": "{ page: number; pageSize: number; total: number }",
      "required": false,
      "description": "Pagination configuration"
    }
  ],
  "styling": {
    "colorScheme": "default",
    "className": "w-full border-collapse"
  },
  "accessibility": {
    "role": "table",
    "ariaLabel": "Data table with sorting and filtering"
  },
  "customContent": `
    <table className={cn("w-full caption-bottom text-sm", className)}>
      <thead className="[&_tr]:border-b">
        <tr className="border-b transition-colors hover:bg-muted/50">
          {columns.map((column) => (
            <th key={column.key} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              {column.label}
              {column.sortable && (
                <button onClick={() => onSort?.(column.key, 'asc')} className="ml-2">
                  ↕️
                </button>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="[&_tr:last-child]:border-0">
        {data.map((row, index) => (
          <tr key={index} className="border-b transition-colors hover:bg-muted/50">
            {columns.map((column) => (
              <td key={column.key} className="p-4 align-middle">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  `
}
```

## 2. Multi-Step Form Component

**Scenario:** Create a wizard-style form component with multiple steps.

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "FormWizard",
  "type": "form",
  "description": "Multi-step form wizard with navigation and validation",
  "props": [
    {
      "name": "steps",
      "type": "Array<{ id: string; title: string; component: React.ComponentType }>",
      "required": true,
      "description": "Form steps configuration"
    },
    {
      "name": "currentStep",
      "type": "number",
      "required": true,
      "description": "Current active step index"
    },
    {
      "name": "onStepChange",
      "type": "(step: number) => void",
      "required": true,
      "description": "Step change handler"
    },
    {
      "name": "onSubmit",
      "type": "(data: Record<string, any>) => void",
      "required": true,
      "description": "Form submission handler"
    },
    {
      "name": "validation",
      "type": "Record<string, (value: any) => string | undefined>",
      "required": false,
      "description": "Field validation functions"
    }
  ],
  "styling": {
    "colorScheme": "primary"
  },
  "accessibility": {
    "role": "form",
    "ariaLabel": "Multi-step form wizard"
  },
  "children": true
}
```

## 3. Component with Animation and Transitions

**Scenario:** Create an animated notification component.

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "AnimatedNotification",
  "type": "feedback",
  "description": "Animated notification component with auto-dismiss",
  "props": [
    {
      "name": "type",
      "type": "'success' | 'error' | 'warning' | 'info'",
      "required": true,
      "description": "Notification type"
    },
    {
      "name": "title",
      "type": "string",
      "required": true,
      "description": "Notification title"
    },
    {
      "name": "message",
      "type": "string",
      "required": false,
      "description": "Notification message"
    },
    {
      "name": "autoClose",
      "type": "boolean",
      "required": false,
      "defaultValue": "true",
      "description": "Auto-close after delay"
    },
    {
      "name": "duration",
      "type": "number",
      "required": false,
      "defaultValue": "5000",
      "description": "Auto-close duration in milliseconds"
    },
    {
      "name": "onClose",
      "type": "() => void",
      "required": false,
      "description": "Close handler function"
    }
  ],
  "styling": {
    "className": "animate-in slide-in-from-right duration-300"
  },
  "accessibility": {
    "role": "alert",
    "ariaLabel": "Notification message"
  }
}
```

## 4. Compound Component Pattern

**Scenario:** Create a dropdown menu with compound components.

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "DropdownMenu",
  "type": "dropdown",
  "description": "Dropdown menu with compound component pattern",
  "props": [
    {
      "name": "open",
      "type": "boolean",
      "required": false,
      "description": "Controlled open state"
    },
    {
      "name": "onOpenChange",
      "type": "(open: boolean) => void",
      "required": false,
      "description": "Open state change handler"
    },
    {
      "name": "placement",
      "type": "'top' | 'bottom' | 'left' | 'right'",
      "required": false,
      "defaultValue": "bottom",
      "description": "Menu placement"
    }
  ],
  "children": true,
  "customContent": `
    // This would generate a compound component with:
    // - DropdownMenu (root)
    // - DropdownMenuTrigger
    // - DropdownMenuContent
    // - DropdownMenuItem
    // - DropdownMenuSeparator
    // - DropdownMenuLabel
  `
}
```

## 5. Component with Custom Hooks Integration

**Scenario:** Create a component that integrates with custom hooks.

**Tool:** `generate_component`

**Input:**

```json
{
  "name": "SearchableSelect",
  "type": "input",
  "description": "Searchable select component with async data loading",
  "props": [
    {
      "name": "options",
      "type": "Array<{ value: string; label: string }>",
      "required": false,
      "description": "Static options array"
    },
    {
      "name": "loadOptions",
      "type": "(query: string) => Promise<Array<{ value: string; label: string }>>",
      "required": false,
      "description": "Async options loader"
    },
    {
      "name": "value",
      "type": "string | string[]",
      "required": false,
      "description": "Selected value(s)"
    },
    {
      "name": "onChange",
      "type": "(value: string | string[]) => void",
      "required": false,
      "description": "Value change handler"
    },
    {
      "name": "multiple",
      "type": "boolean",
      "required": false,
      "defaultValue": "false",
      "description": "Allow multiple selections"
    },
    {
      "name": "searchable",
      "type": "boolean",
      "required": false,
      "defaultValue": "true",
      "description": "Enable search functionality"
    },
    {
      "name": "loading",
      "type": "boolean",
      "required": false,
      "description": "Loading state"
    }
  ],
  "accessibility": {
    "role": "combobox",
    "ariaLabel": "Searchable select input"
  }
}
```

## 6. Component Validation with Strict Mode

**Tool:** `validate_component`

**Input:**

```json
{
  "componentCode": "/* Complex component code here */",
  "strict": true
}
```

This will perform comprehensive validation including:

- Accessibility compliance
- TypeScript strict checking
- Performance optimizations
- Shadcn/UI pattern adherence
- Documentation requirements

## 7. Generating Component Variations

You can generate multiple variations of the same component by changing specific properties:

```json
{
  "name": "PrimaryButton",
  "type": "button",
  "variant": "default",
  "styling": { "colorScheme": "primary" }
}
```

```json
{
  "name": "SecondaryButton",
  "type": "button",
  "variant": "outline",
  "styling": { "colorScheme": "secondary" }
}
```

```json
{
  "name": "DestructiveButton",
  "type": "button",
  "variant": "destructive",
  "styling": { "colorScheme": "destructive" }
}
```
