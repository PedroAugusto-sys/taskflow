import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import type { TaskItem, UpdateTaskItem, CreateTaskItem } from './types/task';
import { TaskItemStatus, TaskPriority, taskStatusLabels, taskPriorityLabels } from './types/task';

function App() {
  const [filterStatus, setFilterStatus] = useState<TaskItemStatus | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(filterStatus, filterPriority);

  const handleCreateTask = async (taskData: CreateTaskItem) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleUpdateTask = async (taskData: UpdateTaskItem) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowForm(false);
    }
  };

  const handleEdit = (task: TaskItem) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (task: TaskItem) => {
    const nextStatus = task.status === TaskItemStatus.Open 
      ? TaskItemStatus.InProgress 
      : TaskItemStatus.Completed;
    
    await updateTask(task.id, { status: nextStatus });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const openNewTaskForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const clearFilters = () => {
    setFilterStatus(undefined);
    setFilterPriority(undefined);
  };

  const hasActiveFilters = filterStatus !== undefined || filterPriority !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={openNewTaskForm}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              aria-label="Create new task"
            >
              + New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus ?? ''}
                onChange={(e) => setFilterStatus(e.target.value ? Number(e.target.value) as TaskItemStatus : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {Object.entries(taskStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="filterPriority" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Priority
              </label>
              <select
                id="filterPriority"
                value={filterPriority ?? ''}
                onChange={(e) => setFilterPriority(e.target.value ? Number(e.target.value) as TaskPriority : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                {Object.entries(taskPriorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" role="status" aria-label="Loading tasks">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Get started by creating a new task'}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={openNewTaskForm}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

export default App;
