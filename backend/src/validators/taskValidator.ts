import { z } from 'zod';

const taskStatusEnum = z.enum(['Pending', 'Completed']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  status: taskStatusEnum.optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  status: taskStatusEnum.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
