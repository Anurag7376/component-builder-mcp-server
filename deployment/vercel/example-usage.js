// Example usage of the Vercel-deployed Component Builder API

const API_BASE_URL = "https://your-app.vercel.app/api";

// Example 1: Generate a button component
async function generateButton() {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-component`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "SubmitButton",
        type: "button",
        variant: "default",
        size: "lg",
        description: "A submit button for forms",
        props: [
          {
            name: "loading",
            type: "boolean",
            required: false,
            description: "Show loading spinner",
          },
          {
            name: "disabled",
            type: "boolean",
            required: false,
            description: "Disable the button",
          },
        ],
        children: true,
        accessibility: {
          ariaLabel: "Submit form button",
        },
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Generated component code:");
      console.log(result.data.code);
      console.log("\nImports needed:");
      console.log(result.data.imports.join("\n"));
      console.log("\nDependencies:");
      console.log(result.data.dependencies.join(", "));
    } else {
      console.error("Error:", result.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Example 2: Validate existing component
async function validateComponent() {
  const componentCode = `
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2",
          variant === "outline" ? "border border-input" : "bg-primary text-primary-foreground",
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/validate-component`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        componentCode,
        strict: true,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("\nValidation Results:");
      console.log(`Valid: ${result.data.isValid}`);
      console.log(`Errors: ${result.data.errors.length}`);
      console.log(`Warnings: ${result.data.warnings.length}`);
      console.log(`Suggestions: ${result.data.suggestions.length}`);

      if (result.data.errors.length > 0) {
        console.log("\nErrors:");
        result.data.errors.forEach((error, i) =>
          console.log(`${i + 1}. ${error}`)
        );
      }

      if (result.data.warnings.length > 0) {
        console.log("\nWarnings:");
        result.data.warnings.forEach((warning, i) =>
          console.log(`${i + 1}. ${warning}`)
        );
      }

      if (result.data.suggestions.length > 0) {
        console.log("\nSuggestions:");
        result.data.suggestions.forEach((suggestion, i) =>
          console.log(`${i + 1}. ${suggestion}`)
        );
      }
    } else {
      console.error("Validation error:", result.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Example 3: Get available component types
async function getComponentTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/component-types`);
    const result = await response.json();

    if (result.success) {
      console.log("\nAvailable component types:");
      result.data.forEach((type) => console.log(`- ${type}`));
    } else {
      console.error("Error:", result.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Example 4: Get component template details
async function getComponentTemplate(type = "button") {
  try {
    const response = await fetch(
      `${API_BASE_URL}/component-template?type=${type}`
    );
    const result = await response.json();

    if (result.success) {
      console.log(`\nTemplate for ${type}:`);
      console.log(`Name: ${result.data.name}`);
      console.log(`Description: ${result.data.description}`);
      console.log(`Variants: ${result.data.variants.join(", ")}`);
      console.log("Examples:");
      result.data.examples.forEach((example, i) =>
        console.log(`${i + 1}. ${example}`)
      );
    } else {
      console.error("Error:", result.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Run examples
async function runExamples() {
  console.log("=".repeat(50));
  console.log("Component Builder API Examples");
  console.log("=".repeat(50));

  await generateButton();
  await validateComponent();
  await getComponentTypes();
  await getComponentTemplate("card");
}

// Uncomment to run examples
// runExamples();

// Export functions for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateButton,
    validateComponent,
    getComponentTypes,
    getComponentTemplate,
    runExamples,
  };
}
