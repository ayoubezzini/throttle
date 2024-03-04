# Rate Limiting Middleware for Express

A simple and efficient rate limiting middleware for Express applications, designed to help protect your API from excessive use and ensure fair usage. This package uses an in-memory store by default for tracking request counts, making it easy to integrate and use out of the box.

## Features

- **Easy Integration**: Seamlessly integrates with any Express application.
- **In-Memory Store**: Comes with a built-in in-memory store for IP-based rate limiting.
- **Configurable Limits**: Allows customization of request limits and window times.
- **Extendable**: Designed to be extendable for use with external stores like Redis for distributed applications.

## Usage

First, install the package using npm:

```typescript
import express from 'express';
import { rateLimiter } from '@yi/throttle';

const app = express();
const PORT = 3000;

// Apply rate limiting middleware
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Limit each IP to 100 requests per windowMs
}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## API

- `rateLimiter(options)` Creates and returns the rate limiting middleware.

### Options

- `windowMs`: Number of milliseconds for each rate limiting window (default: 15 minutes).
- `maxRequests`: Maximum number of requests allowed per window per IP (default: 100).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENCE) file for details.
