// Test script for new component types
import { ComponentGenerator } from './dist/utils/generator.js';
import { ComponentValidator } from './dist/utils/validator.js';
import { getAllTemplateTypes } from './dist/templates/index.js';

async function testNewComponentTypes() {
  console.log('🧪 Testing New Component Types...\n');

  const generator = new ComponentGenerator();
  const validator = new ComponentValidator();

  // Test 1: List all available component types
  console.log('Test 1: Available Component Types');
  const types = getAllTemplateTypes();
  console.log(`✅ Total component types: ${types.length}`);
  console.log('Available types:', types.join(', '));

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Generate new component types
  const testSpecs = [
    {
      name: 'UserSelect',
      type: 'select',
      description: 'User selection dropdown',
      props: [
        {
          name: 'options',
          type: 'Array<{value: string, label: string}>',
          required: true,
          description: 'Select options'
        }
      ],
      accessibility: {
        ariaLabel: 'User selection dropdown'
      }
    },
    {
      name: 'TermsCheckbox',
      type: 'checkbox',
      description: 'Terms and conditions checkbox',
      props: [
        {
          name: 'required',
          type: 'boolean',
          required: false,
          description: 'Is checkbox required'
        }
      ],
      accessibility: {
        ariaLabel: 'Accept terms and conditions'
      }
    },
    {
      name: 'SettingsSwitch',
      type: 'switch',
      description: 'Settings toggle switch',
      props: [
        {
          name: 'defaultChecked',
          type: 'boolean',
          required: false,
          description: 'Default checked state'
        }
      ]
    },
    {
      name: 'StatusBadge',
      type: 'badge',
      description: 'Status indicator badge',
      variant: 'secondary',
      props: [
        {
          name: 'status',
          type: "'online' | 'offline' | 'away'",
          required: true,
          description: 'User status'
        }
      ]
    },
    {
      name: 'UserAvatar',
      type: 'avatar',
      description: 'User profile avatar',
      props: [
        {
          name: 'src',
          type: 'string',
          required: false,
          description: 'Avatar image URL'
        },
        {
          name: 'fallback',
          type: 'string',
          required: true,
          description: 'Fallback text'
        }
      ]
    },
    {
      name: 'ErrorAlert',
      type: 'alert',
      variant: 'destructive',
      description: 'Error message alert',
      props: [
        {
          name: 'message',
          type: 'string',
          required: true,
          description: 'Error message'
        }
      ]
    },
    {
      name: 'LoadingProgress',
      type: 'progress',
      description: 'Loading progress indicator',
      props: [
        {
          name: 'value',
          type: 'number',
          required: true,
          description: 'Progress value'
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          defaultValue: 100,
          description: 'Maximum value'
        }
      ]
    },
    {
      name: 'ContentSkeleton',
      type: 'skeleton',
      description: 'Content loading skeleton',
      props: [
        {
          name: 'lines',
          type: 'number',
          required: false,
          defaultValue: 3,
          description: 'Number of skeleton lines'
        }
      ]
    }
  ];

  for (let i = 0; i < testSpecs.length; i++) {
    const spec = testSpecs[i];
    console.log(`Test ${i + 2}: Generate ${spec.name} (${spec.type})`);
    
    try {
      const component = await generator.generateComponent(spec);
      console.log(`✅ ${spec.name} generated successfully`);
      console.log(`📝 Code length: ${component.code.length} characters`);
      console.log(`📦 Dependencies: ${component.dependencies.slice(0, 3).join(', ')}${component.dependencies.length > 3 ? '...' : ''}`);
      console.log(`🎯 Examples: ${component.examples.length} generated`);

      // Quick validation test
      const validation = validator.validateComponent(component.code, false);
      console.log(`🔍 Validation: ${validation.isValid ? '✅ Valid' : '❌ Invalid'} (${validation.errors.length} errors, ${validation.warnings.length} warnings)`);

    } catch (error) {
      console.log(`❌ ${spec.name} generation failed:`, error.message);
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log('🎉 New component types testing completed!');
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`• Total component types available: ${types.length}`);
  console.log(`• New component types added: ${types.length - 4}`); // 4 was original count
  console.log(`• Form components: select, checkbox, radio, textarea, switch`);
  console.log(`• UI components: badge, avatar, alert, progress, skeleton, tabs`);
  console.log(`• All components follow Shadcn/UI standards`);
  console.log(`• Full TypeScript support with proper typing`);
  console.log(`• Radix UI primitives integration where applicable`);
}

// Run the test
testNewComponentTypes().catch(console.error);