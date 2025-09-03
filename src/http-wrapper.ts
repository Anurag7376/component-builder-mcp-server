import express from 'express';
import cors from 'cors';
import { ComponentGenerator } from './utils/generator.js';
import { ComponentValidator } from './utils/validator.js';
import { ComponentSpecSchema, ComponentValidationSchema } from './types/component.js';
import { getAllTemplateTypes, getTemplate } from './templates/index.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize services
const generator = new ComponentGenerator();
const validator = new ComponentValidator();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MCP Tool endpoints
app.post('/api/generate-component', async (req, res) => {
  try {
    const spec = ComponentSpecSchema.parse(req.body);
    const component = await generator.generateComponent(spec);
    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/validate-component', async (req, res) => {
  try {
    const { componentCode, strict } = ComponentValidationSchema.parse(req.body);
    const result = validator.validateComponent(componentCode, strict);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/component-types', (req, res) => {
  try {
    const types = getAllTemplateTypes();
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/component-template/:type', (req, res) => {
  try {
    const { type } = req.params;
    const template = getTemplate(type);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: `Template not found for type: ${type}`
      });
    }
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🌐 HTTP wrapper for MCP server running on port ${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`  POST /api/generate-component`);
  console.log(`  POST /api/validate-component`);
  console.log(`  GET  /api/component-types`);
  console.log(`  GET  /api/component-template/:type`);
  console.log(`  GET  /health`);
});

export default app;