import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface AuthConfig {
  apiKeys: string[];
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
  };
}

export class AuthMiddleware {
  private config: AuthConfig;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: AuthConfig) {
    this.config = config;
  }

  // API Key authentication
  validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    if (!this.config.apiKeys.includes(apiKey)) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
  };

  // Rate limiting
  rateLimit = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = this.config.rateLimiting.windowMs;
    
    if (!this.requestCounts.has(clientId)) {
      this.requestCounts.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const clientData = this.requestCounts.get(clientId)!;
    
    if (now > clientData.resetTime) {
      // Reset window
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
      return next();
    }

    if (clientData.count >= this.config.rateLimiting.maxRequests) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        resetTime: new Date(clientData.resetTime).toISOString()
      });
    }

    clientData.count++;
    next();
  };

  // Request validation
  validateRequest = (req: Request, res: Response, next: NextFunction) => {
    // Validate content length
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 1024 * 1024) { // 1MB limit
      return res.status(413).json({ error: 'Request too large' });
    }

    // Validate content type
    if (req.method === 'POST' && !req.headers['content-type']?.includes('application/json')) {
      return res.status(400).json({ error: 'Content-Type must be application/json' });
    }

    next();
  };
}