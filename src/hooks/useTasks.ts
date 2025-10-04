import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { tasksAPI } from '../services/api';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tasks from backend on mount (only if authenticated)
    useEffect(() => {
        const fetchTasks = async () => {
            // Check if user is authenticated
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await tasksAPI.getAll();
                setTasks(data);
            } catch (err) {
                console.error("Failed to load tasks from backend", err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
                setTasks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const addTask = useCallback(async (title: string, dueDate: string, _userId: string) => {
        try {
            setError(null);
            const newTask = await tasksAPI.create({
                title,
                dueDate,
                status: TaskStatus.Pending,
            });
            setTasks(prev => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar tarefa';
            setError(errorMessage);
            console.error("Failed to create task", err);
            throw err;
        }
    }, []);

    const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
        try {
            setError(null);
            await tasksAPI.update(taskId, { status });
            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, status } : task
            ));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar tarefa';
            setError(errorMessage);
            console.error("Failed to update task", err);
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (taskId: string) => {
        try {
            setError(null);
            await tasksAPI.delete(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir tarefa';
            setError(errorMessage);
            console.error("Failed to delete task", err);
            throw err;
        }
    }, []);

    return useMemo(() => ({
        tasks,
        isLoading,
        error,
        addTask,
        updateTaskStatus,
        deleteTask,
    }), [tasks, isLoading, error, addTask, updateTaskStatus, deleteTask]);
};
