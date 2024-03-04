import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Options for configuring the rate limiter middleware.
 */
interface RateLimitOptions {
  /** Window time in milliseconds for rate limiting. */
  windowMs: number;
  /** Maximum number of requests allowed per window per IP. */
  maxRequests: number;
}

/**
 * Simple in-memory store for tracking request timestamps.
 */
class MemoryStore {
  /** Object to store hit timestamps keyed by IP. */
  hits: { [key: string]: number[] } = {};

  /**
   * Increments the count for a given key within the rate limit window.
   * @param key The key to increment, typically the IP address.
   */
  increment(key: string) {
    const now = Date.now();
    if (!this.hits[key]) {
      this.hits[key] = [];
    }
    this.hits[key].push(now);
    // Remove timestamps outside the current window
    this.hits[key] = this.hits[key].filter(timestamp => now - timestamp <= 60000);
  }

  /**
   * Retrieves the count of hits for a given key.
   * @param key The key for which to retrieve the count.
   * @returns The number of hits for the key.
   */
  getCount(key: string): number {
    return this.hits[key] ? this.hits[key].length : 0;
  }
}

/**
 * Creates a rate limiting middleware function.
 * @param options The configuration options for the rate limiter.
 * @returns An Express middleware function for rate limiting.
 */
export const rateLimiter = (options: RateLimitOptions): RequestHandler => {
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
