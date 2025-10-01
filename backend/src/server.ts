import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import agreementRoutes from './routes/agreementRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'CRM Honorários API' });
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
