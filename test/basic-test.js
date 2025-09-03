import { ComponentGenerator } from "../dist/utils/generator.js";
import { ComponentValidator } from "../dist/utils/validator.js";

async function testComponentGeneration() {
  console.log("🧪 Testing Component Generation...\n");

  const generator = new ComponentGenerator();
  const validator = new ComponentValidator();

  // Test 1: Generate a simple button
  console.log("Test 1: Generate a simple button component");
  const buttonSpec = {
    name: "CustomButton",
    type: "button",
    description: "A custom button component",
    children: true,
    size: "md",
    props: [
      {
        name: "variant",
        type: "string",
        required: false,
        description: "Button variant",
        defaultValue: "default",
      },
    ],
  };

  try {
    const buttonComponent = await generator.generateComponent(buttonSpec);
    console.log("✅ Button component generated successfully");
    console.log(`📝 Component name: ${buttonComponent.name}`);
    console.log(`📦 Dependencies: ${buttonComponent.dependencies.join(", ")}`);
    console.log(
      `📚 Documentation length: ${buttonComponent.documentation.length} characters`
    );
    console.log(`🎯 Examples count: ${buttonComponent.examples.length}`);
  } catch (error) {
    console.log("❌ Button component generation failed:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Generate an input component
  console.log("Test 2: Generate an input component");
  const inputSpec = {
    name: "EmailInput",
    type: "input",
    description: "Email input with validation",
    size: "md",
    props: [
      {
        name: "placeholder",
        type: "string",
        required: false,
        description: "Input placeholder",
      },
    ],
    accessibility: {
      ariaLabel: "Email input field",
      role: "textbox",
    },
  };

  try {
    const inputComponent = await generator.generateComponent(inputSpec);
    console.log("✅ Input component generated successfully");
    console.log(`📝 Component name: ${inputComponent.name}`);
    console.log(`📦 Dependencies: ${inputComponent.dependencies.join(", ")}`);
  } catch (error) {
    console.log("❌ Input component generation failed:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Validate a simple component
  console.log("Test 3: Validate a React component");
  const sampleCode = `
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2",
          variant === "outline" ? "border border-input" : "bg-primary text-primary-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
  `;

  try {
    const validationResult = validator.validateComponent(sampleCode, false);
    console.log(`✅ Validation completed`);
    console.log(`🎯 Is valid: ${validationResult.isValid}`);
    console.log(`❌ Errors: ${validationResult.errors.length}`);
    console.log(`⚠️  Warnings: ${validationResult.warnings.length}`);
    console.log(`💡 Suggestions: ${validationResult.suggestions.length}`);

    if (validationResult.errors.length > 0) {
      console.log("Errors:", validationResult.errors);
    }
    if (validationResult.warnings.length > 0) {
      console.log("Warnings:", validationResult.warnings);
    }
  } catch (error) {
    console.log("❌ Validation failed:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Template functionality
  console.log("Test 4: Testing template system");
  try {
    const { getAllTemplateTypes, getTemplate } = await import(
      "../dist/templates/index.js"
    );
    const types = getAllTemplateTypes();
    console.log(`✅ Available template types: ${types.join(", ")}`);

    const buttonTemplate = getTemplate("button");
    if (buttonTemplate) {
      console.log(`✅ Button template found: ${buttonTemplate.name}`);
      console.log(`📝 Description: ${buttonTemplate.description}`);
      console.log(`🎨 Variants: ${buttonTemplate.variants.join(", ")}`);
    }
  } catch (error) {
    console.log("❌ Template system test failed:", error);
  }

  console.log("\n🎉 All tests completed!");
}

// Run tests
testComponentGeneration().catch(console.error);
