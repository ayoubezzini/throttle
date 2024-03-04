import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number; // Window time in milliseconds
  maxRequests: number; // Max number of requests per window per IP
}

// Simple in-memory store
class MemoryStore {
  hits: { [key: string]: number[] } = {};

  increment(key: string) {
    const now = Date.now();
    if (!this.hits[key]) {
      this.hits[key] = [];
    }
    this.hits[key].push(now);
    this.hits[key] = this.hits[key].filter(timestamp => now - timestamp <= 60000); // Keep only the timestamps within the last minute
  }

  getCount(key: string) {
    return this.hits[key] ? this.hits[key].length : 0;
  }
}

export const rateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests } = options;
  const store = new MemoryStore();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? '0.0.0.0'; // Use the client's IP address as the key
    store.increment(key);

    const requestCount = store.getCount(key);
    if (requestCount > maxRequests) {
      res.status(429).send('Too many requests, please try again later.');
      return;
    }

    next();
  };
};
