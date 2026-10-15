import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import type { TaskItem, CreateTaskItem, UpdateTaskItem, TaskItemStatus, TaskPriority } from '../types/task';

export function useTasks(filterStatus?: TaskItemStatus, filterPriority?: TaskPriority) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAllTasks(filterStatus, filterPriority);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (task: CreateTaskItem) => {
    try {
      setError(null);
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: number, task: UpdateTaskItem) => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(id, task);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
