import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../validators/taskValidator';

const prisma = new PrismaClient();

// GET /api/tasks - List all tasks for logged user
export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    const { status } = req.query;

    const where: any = {
      userId: req.user.userId,
    };

    if (status) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tarefas',
    });
  }
};

// GET /api/tasks/:id - Get single task
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.userId, // Only allow user to see their own tasks
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tarefa',
    });
  }
};

// POST /api/tasks - Create new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    const validationResult = createTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    const data = validationResult.data;

    const task = await prisma.task.create({
      data: {
        userId: req.user.userId, // Associate with logged user
        title: data.title,
        dueDate: data.dueDate,
        status: data.status || 'Pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Tarefa criada com sucesso',
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar tarefa',
    });
  }
};

// PUT /api/tasks/:id - Update task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    const { id } = req.params;

    const validationResult = updateTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.userId, // Only allow user to update their own tasks
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada',
      });
    }

    const data = validationResult.data;

    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: task,
      message: 'Tarefa atualizada com sucesso',
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar tarefa',
    });
  }
};

// DELETE /api/tasks/:id - Delete task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    const { id } = req.params;

    // Check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: req.user.userId, // Only allow user to delete their own tasks
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada',
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Tarefa excluída com sucesso',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir tarefa',
    });
  }
};
