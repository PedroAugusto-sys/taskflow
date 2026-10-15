export enum TaskItemStatus {
  Open = 0,
  InProgress = 1,
  UnderReview = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskItemStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
  assignedTo: string;
  category: string;
}

export interface CreateTaskItem {
  title: string;
  description: string;
  priority: TaskPriority;
  assignedTo: string;
  category: string;
}

export interface UpdateTaskItem {
  title?: string;
  description?: string;
  status?: TaskItemStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  category?: string;
}

export const taskStatusLabels: Record<TaskItemStatus, string> = {
  [TaskItemStatus.Open]: 'Open',
  [TaskItemStatus.InProgress]: 'In Progress',
  [TaskItemStatus.UnderReview]: 'Under Review',
  [TaskItemStatus.Completed]: 'Completed',
  [TaskItemStatus.Cancelled]: 'Cancelled',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.Low]: 'Low',
  [TaskPriority.Medium]: 'Medium',
  [TaskPriority.High]: 'High',
  [TaskPriority.Critical]: 'Critical',
};
