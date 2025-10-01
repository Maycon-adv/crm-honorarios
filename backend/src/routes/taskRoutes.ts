import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes are protected by authentication
router.use(authenticate);

// GET /api/tasks - List all tasks for logged user (with optional filter)
router.get('/', getAllTasks);

// GET /api/tasks/:id - Get single task
router.get('/:id', getTaskById);

// POST /api/tasks - Create new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

export default router;
