using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Services;

public class TaskService : ITaskService
{
    private readonly TaskFlowContext _context;

    public TaskService(TaskFlowContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync(TaskItemStatus? status = null, TaskPriority? priority = null)
    {
        var query = _context.Tasks.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id)
    {
        return await _context.Tasks.FindAsync(id);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskItem task)
    {
        if (task == null)
        {
            throw new ArgumentNullException(nameof(task));
        }

        task.CreatedAt = DateTime.UtcNow;
        task.Status = TaskItemStatus.Open;

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask)
    {
        if (updatedTask == null)
        {
            throw new ArgumentNullException(nameof(updatedTask));
        }

        var existingTask = await _context.Tasks.FindAsync(id);
        if (existingTask == null)
        {
            return null;
        }

        existingTask.Title = updatedTask.Title;
        existingTask.Description = updatedTask.Description;
        existingTask.Status = updatedTask.Status;
        existingTask.Priority = updatedTask.Priority;
        existingTask.AssignedTo = updatedTask.AssignedTo;
        existingTask.Category = updatedTask.Category;
        existingTask.UpdatedAt = DateTime.UtcNow;

        if (updatedTask.Status == TaskItemStatus.Completed && existingTask.CompletedAt == null)
        {
            existingTask.CompletedAt = DateTime.UtcNow;
        }
        else if (updatedTask.Status != TaskItemStatus.Completed)
        {
            existingTask.CompletedAt = null;
        }

        await _context.SaveChangesAsync();

        return existingTask;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return false;
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByAssigneeAsync(string assignee)
    {
        if (string.IsNullOrWhiteSpace(assignee))
        {
            return Enumerable.Empty<TaskItem>();
        }

        return await _context.Tasks
            .Where(t => t.AssignedTo.ToLower() == assignee.ToLower())
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByCategoryAsync(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return Enumerable.Empty<TaskItem>();
        }

        return await _context.Tasks
            .Where(t => t.Category.ToLower() == category.ToLower())
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
