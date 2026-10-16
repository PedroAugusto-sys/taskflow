using TaskFlow.Api.Models;

namespace TaskFlow.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync(TaskItemStatus? status = null, TaskPriority? priority = null);
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<TaskItem> CreateTaskAsync(TaskItem task);
    Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask);
    Task<bool> DeleteTaskAsync(int id);
    Task<IEnumerable<TaskItem>> GetTasksByAssigneeAsync(string assignee);
    Task<IEnumerable<TaskItem>> GetTasksByCategoryAsync(string category);
}
