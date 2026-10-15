import type { TaskItem } from '../types/task';
import { taskStatusLabels, taskPriorityLabels, TaskStatus } from '../types/task';

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: number) => void;
  onStatusChange: (task: TaskItem) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const priorityColors: Record<number, string> = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-red-100 text-red-800',
  };

  const statusColors: Record<number, string> = {
    0: 'bg-yellow-100 text-yellow-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-purple-100 text-purple-800',
    3: 'bg-green-100 text-green-800',
    4: 'bg-gray-100 text-gray-800',
  };

  const getStatusAction = () => {
    if (task.status === TaskStatus.Open) {
      return { label: 'Start', nextStatus: TaskStatus.InProgress };
    }
    if (task.status === TaskStatus.InProgress) {
      return { label: 'Complete', nextStatus: TaskStatus.Completed };
    }
    return null;
  };

  const statusAction = getStatusAction();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
            {taskPriorityLabels[task.priority]}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
            {taskStatusLabels[task.status]}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
        {task.assignedTo && (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {task.assignedTo}
          </span>
        )}
        {task.category && (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {task.category}
          </span>
        )}
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2">
        {statusAction && (
          <button
            onClick={() => onStatusChange(task)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
            aria-label={`${statusAction.label} task`}
          >
            {statusAction.label}
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
