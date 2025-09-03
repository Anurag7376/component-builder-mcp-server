# Component Builder MCP Server

MCP server for generating custom components based on Shadcn UI standards and criteria.

## Features

- 🎨 Generate custom React components following Shadcn/UI patterns
- 📝 TypeScript support with proper type definitions
- 🎯 Tailwind CSS integration with class variance authority
- ✅ Component validation and standards checking
- 📚 Template-based generation system
- ♿ Accessibility-first approach
- 🔍 Comprehensive validation with suggestions

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

The server runs via stdio and can be integrated with MCP-compatible clients:

```bash
npm start
```

### Testing

Run the built-in tests to verify functionality:

```bash
npm test
```

## Available Tools

### 🔧 generate_component

Create a new component based on specifications with:

- Component type selection (button, input, card, modal, etc.)
- Custom props definition
- Styling and accessibility configuration
- Size and variant options

### ✅ validate_component

Check if a component follows Shadcn standards:

- TypeScript validation
- Accessibility compliance
- Performance suggestions
- Code quality checks

### 📋 list_component_types

Get available component types and templates with:

- Detailed descriptions
- Available variants
- Usage examples

### 📖 get_component_template

Retrieve specific component template information:

- Template structure
- Configuration options
- Implementation examples

### 🎯 generate_component_examples

Generate usage examples for component types:

- Basic usage patterns
- Advanced configurations
- Real-world scenarios

## Component Types

| Type           | Description                              | Variants                                              |
| -------------- | ---------------------------------------- | ----------------------------------------------------- |
| `button`       | Interactive button with multiple styles  | default, destructive, outline, secondary, ghost, link |
| `input`        | Form input with proper styling           | default                                               |
| `card`         | Flexible card with header/content/footer | default                                               |
| `modal`        | Modal dialog with Radix UI primitives    | default                                               |
| `dropdown`     | Dropdown menu with keyboard navigation   | default                                               |
| `form`         | Form components with validation          | default                                               |
| `navigation`   | Navigation menus and breadcrumbs         | default                                               |
| `layout`       | Layout components for page structure     | default                                               |
| `data-display` | Tables, lists, and data components       | default                                               |
| `feedback`     | Alerts, notifications, and feedback      | default                                               |
| `custom`       | Flexible custom component type           | configurable                                          |

## Component Standards

This server follows Shadcn/UI standards including:

### ✨ Code Quality

- Proper TypeScript typing with generics
- React.forwardRef for ref handling
- DisplayName for debugging
- Consistent naming conventions (PascalCase)

### 🎨 Styling

- Tailwind CSS classes with semantic tokens
- Class Variance Authority for variant handling
- `cn()` utility for className composition
- Consistent color schemes and sizing

### ♿ Accessibility

- ARIA attributes and roles
- Keyboard navigation support
- Focus management and visible focus indicators
- Semantic HTML elements

### ⚡ Performance

- Optimized re-rendering patterns
- Proper memoization usage
- Component size considerations
- Efficient prop handling

## Example Usage

### Generate a Custom Button

```json
{
  "name": "SubmitButton",
  "type": "button",
  "description": "Form submission button with loading state",
  "variant": "default",
  "size": "lg",
  "props": [
    {
      "name": "loading",
      "type": "boolean",
      "required": false,
      "description": "Show loading spinner"
    }
  ],
  "children": true,
  "accessibility": {
    "ariaLabel": "Submit form"
  }
}
```

### Validate Component Code

```json
{
  "componentCode": "your-component-code-here",
  "strict": true
}
```

## Configuration

Example MCP client configuration:

```json
{
  "mcpServers": {
    "component-builder": {
      "command": "node",
      "args": ["/path/to/component-builder-mcp-server/dist/index.js"],
      "description": "Component Builder MCP Server"
    }
  }
}
```

## Development

### Project Structure

```
src/
├── index.ts              # Main MCP server
├── types/
│   └── component.ts      # TypeScript type definitions
├── templates/
│   ├── *.hbs            # Handlebars templates
│   └── index.ts         # Template registry
├── utils/
│   ├── generator.ts     # Component generation logic
│   ├── validator.ts     # Component validation
│   └── helpers.ts       # Utility functions
examples/
├── basic-usage.md       # Basic usage examples
├── advanced-usage.md    # Advanced examples
└── api-reference.md     # Complete API documentation
test/
└── basic-test.js        # Integration tests
```

### Building

```bash
npm run build    # Build TypeScript and copy templates
npm run dev      # Watch mode for development
```

### Testing

```bash
npm test         # Run integration tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Update documentation
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
