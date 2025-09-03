import { VercelRequest, VercelResponse } from '@vercel/node';
import { ComponentGenerator } from '../src/utils/generator.js';
import { ComponentSpecSchema } from '../src/types/component.js';

const generator = new ComponentGenerator();

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
    const spec = ComponentSpecSchema.parse(req.body);
    const component = await generator.generateComponent(spec);

    res.status(200).json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Generate component error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}