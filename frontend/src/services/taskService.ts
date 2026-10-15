import axios from 'axios';
import type {
  TaskItem,
  CreateTaskItem,
  UpdateTaskItem,
  TaskStatus,
  TaskPriority,
} from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  async getAllTasks(status?: TaskStatus, priority?: TaskPriority): Promise<TaskItem[]> {
    const params = new URLSearchParams();
    if (status !== undefined) params.append('status', status.toString());
    if (priority !== undefined) params.append('priority', priority.toString());

    const response = await api.get<TaskItem[]>(`/api/tasks?${params.toString()}`);
    return response.data;
  },

  async getTaskById(id: number): Promise<TaskItem> {
    const response = await api.get<TaskItem>(`/api/tasks/${id}`);
    return response.data;
  },

  async createTask(task: CreateTaskItem): Promise<TaskItem> {
    const response = await api.post<TaskItem>('/api/tasks', task);
    return response.data;
  },

  async updateTask(id: number, task: UpdateTaskItem): Promise<TaskItem> {
    const response = await api.put<TaskItem>(`/api/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/api/tasks/${id}`);
  },

  async getTasksByAssignee(assignee: string): Promise<TaskItem[]> {
    const response = await api.get<TaskItem[]>(`/api/tasks/assignee/${assignee}`);
    return response.data;
  },

  async getTasksByCategory(category: string): Promise<TaskItem[]> {
    const response = await api.get<TaskItem[]>(`/api/tasks/category/${category}`);
    return response.data;
  },
};
