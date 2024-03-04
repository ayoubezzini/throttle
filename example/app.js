import express from 'express';
import { rateLimiter } from '../throttle';

const app = express();
const PORT = 3000;

app.use(rateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 5, // Limit each IP to 5 requests per windowMs
}));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));