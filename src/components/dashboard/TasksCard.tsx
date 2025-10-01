import React, { useState, useMemo } from 'react';
import { useTasksContext, useAuthContext } from '../../contexts';
import { ICONS } from '../../constants';
import { Task, TaskStatus } from '../../types';
import { formatDate, getTodayISO } from '../../utils/helpers';

const TasksCard: React.FC = () => {
    const { tasks, addTask, updateTaskStatus, deleteTask } = useTasksContext();
    const { currentUser } = useAuthContext();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState(getTodayISO());

    const userTasks = useMemo(() => {
        if (!currentUser) return [];
        return tasks
            .filter(task => task.userId === currentUser.id)
            .sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status === TaskStatus.Pending ? -1 : 1;
                }
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
    }, [tasks, currentUser]);
    
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim() && currentUser) {
            addTask(newTaskTitle.trim(), newTaskDueDate, currentUser.id);
            setNewTaskTitle('');
        }
    };
    
    const handleToggleTask = (task: Task) => {
        const newStatus = task.status === TaskStatus.Pending ? TaskStatus.Completed : TaskStatus.Pending;
        updateTaskStatus(task.id, newStatus);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="mr-3 text-brand-secondary">{ICONS.tasks}</span>
                Minhas Tarefas
            </h3>
            <div className="flex-grow space-y-3 overflow-y-auto max-h-64 pr-2">
                {userTasks.length > 0 ? (
                    userTasks.map(task => {
                        const isOverdue = task.dueDate < getTodayISO() && task.status === TaskStatus.Pending;
                        return (
                            <div key={task.id} className="flex items-center justify-between group">
                                <div className="flex items-center flex-grow">
                                    <input
                                        type="checkbox"
                                        checked={task.status === TaskStatus.Completed}
                                        onChange={() => handleToggleTask(task)}
                                        className="h-5 w-5 rounded border-gray-300 text-brand-accent focus:ring-brand-accent cursor-pointer"
                                    />
                                    <div className="ml-3 flex-grow">
                                        <p className={`text-sm font-medium text-gray-800 ${task.status === TaskStatus.Completed ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </p>
                                        <p className={`text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                            Vence em: {formatDate(task.dueDate)}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Excluir tarefa">
                                    {ICONS.delete}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma tarefa pendente. Adicione uma abaixo!</p>
                )}
            </div>
            <form onSubmit={handleAddTask} className="mt-auto pt-4 border-t border-gray-200 flex items-center gap-2">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Adicionar nova tarefa..."
                    className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:ring-brand-accent focus:border-brand-accent"
                />
                <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm focus:ring-brand-accent focus:border-brand-accent"
                />
                <button type="submit" className="bg-brand-accent text-white p-2 rounded-md hover:bg-brand-secondary" aria-label="Adicionar tarefa">
                    +
                </button>
            </form>
        </div>
    );
};

export default TasksCard;
