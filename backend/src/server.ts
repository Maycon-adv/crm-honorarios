import express, { Request, Response } from 'express';
import cors, { CorsOptionsDelegate } from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import agreementRoutes from './routes/agreementRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptionsDelegate<Request> = (req, callback) => {
  const origin = req.headers.origin;

  if (!origin) {
    return callback(null, { origin: true, credentials: true });
  }

  if (configuredOrigins.includes(origin)) {
    return callback(null, { origin: true, credentials: true });
  }

  try {
    const hostname = new URL(origin).hostname;
    const allowedHostnames = new Set(['localhost', '127.0.0.1', 'schulze.com.br']);
    const allowedSuffixes = ['.vercel.app', '.schulze.com.br'];

    const isAllowedHostname =
      allowedHostnames.has(hostname) ||
      allowedSuffixes.some(suffix => hostname.endsWith(suffix));

    if (isAllowedHostname) {
      return callback(null, { origin: true, credentials: true });
    }
  } catch (error) {
    console.warn('Failed to parse origin hostname', origin, error);
  }

  callback(new Error('Not allowed by CORS'));
};

// Rate limiting for auth routes (prevent brute force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware - CORS configuration (allow localhost, *.vercel.app e dominios schulze)
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiLimiter); // Apply to all API routes

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
    }
  });
});

// API Routes
app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'CRM Honorários API' });
});

// Auth Routes (with stricter rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Contact Routes (protected)
app.use('/api/contacts', contactRoutes);

// Agreement Routes (protected)
app.use('/api/agreements', agreementRoutes);

// Task Routes (protected)
app.use('/api/tasks', taskRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server (only if not in serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
