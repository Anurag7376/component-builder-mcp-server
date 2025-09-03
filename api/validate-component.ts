import { VercelRequest, VercelResponse } from '@vercel/node';
import { ComponentValidator } from '../src/utils/validator.js';
import { ComponentValidationSchema } from '../../../src/types/component.js';

const validator = new ComponentValidator();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { componentCode, strict } = ComponentValidationSchema.parse(req.body);
    const result = validator.validateComponent(componentCode, strict);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Validate component error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}