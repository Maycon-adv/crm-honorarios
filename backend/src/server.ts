import express, { Request, Response } from 'express';
import cors, { CorsOptionsDelegate } from 'cors';
import dotenv from 'dotenv';
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

// Middleware - CORS configuration (allow localhost, *.vercel.app e dominios schulze)
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get('/health', async (_req: Request, res: Response) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Test database connection
    await prisma.$connect();
    const userCount = await prisma.user.count();
    await prisma.$disconnect();

    res.json({
      status: 'ok',
      message: 'Server is running',
      database: 'connected',
      userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: String(error),
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  }
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'CRM Honor�rios API' });
});

// Auth Routes
app.use('/api/auth', authRoutes);

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
    console.log(Server running on http://localhost:);
  });
}

// Export for Vercel serverless
export default app;
