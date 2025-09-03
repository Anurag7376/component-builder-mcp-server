import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTemplate } from '../../../src/templates/index.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;
    
    if (!type || typeof type !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Component type is required'
      });
    }

    const template = getTemplate(type);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: `Template not found for type: ${type}`
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Get component template error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}