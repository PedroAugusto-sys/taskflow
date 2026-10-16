using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;
using TaskFlow.Api.Services;

namespace TaskFlow.Tests.Services;

public class TaskServiceTests : IDisposable
{
    private readonly TaskFlowContext _context;
    private readonly TaskService _service;

    public TaskServiceTests()
    {
        var options = new DbContextOptionsBuilder<TaskFlowContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TaskFlowContext(options);
        _service = new TaskService(_context);
    }

    [Fact]
    public async Task CreateTaskAsync_ShouldCreateTask_WithValidData()
    {
        var task = new TaskItem
        {
            Title = "Test Task",
            Description = "Test Description for the task",
            Priority = TaskPriority.High,
            AssignedTo = "John Doe",
            Category = "Development"
        };

        var result = await _service.CreateTaskAsync(task);

        result.Should().NotBeNull();
        result.Id.Should().BeGreaterThan(0);
        result.Status.Should().Be(TaskItemStatus.Open);
        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task CreateTaskAsync_ShouldThrowException_WhenTaskIsNull()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _service.CreateTaskAsync(null!));
    }

    [Fact]
    public async Task GetTaskByIdAsync_ShouldReturnTask_WhenTaskExists()
    {
        var task = new TaskItem
        {
            Title = "Existing Task",
            Description = "This is an existing task in the database",
            Priority = TaskPriority.Medium
        };
        await _service.CreateTaskAsync(task);

        var result = await _service.GetTaskByIdAsync(task.Id);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Existing Task");
    }

    [Fact]
    public async Task GetTaskByIdAsync_ShouldReturnNull_WhenTaskDoesNotExist()
    {
        var result = await _service.GetTaskByIdAsync(999);

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllTasksAsync_ShouldReturnAllTasks()
    {
        await _service.CreateTaskAsync(new TaskItem { Title = "Task 1", Description = "Description 1 for task" });
        await _service.CreateTaskAsync(new TaskItem { Title = "Task 2", Description = "Description 2 for task" });
        await _service.CreateTaskAsync(new TaskItem { Title = "Task 3", Description = "Description 3 for task" });

        var result = await _service.GetAllTasksAsync();

        result.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetAllTasksAsync_ShouldFilterByStatus()
    {
        await _service.CreateTaskAsync(new TaskItem { Title = "Open Task", Description = "Open task description", Status = TaskItemStatus.Open });
        var completedTask = await _service.CreateTaskAsync(new TaskItem { Title = "Task to Complete", Description = "Task that will be completed" });
        
        completedTask.Status = TaskItemStatus.Completed;
        await _service.UpdateTaskAsync(completedTask.Id, completedTask);

        var result = await _service.GetAllTasksAsync(status: TaskItemStatus.Completed);

        result.Should().HaveCount(1);
        result.First().Status.Should().Be(TaskItemStatus.Completed);
    }

    [Fact]
    public async Task GetAllTasksAsync_ShouldFilterByPriority()
    {
        await _service.CreateTaskAsync(new TaskItem { Title = "Low Priority", Description = "Low priority task description", Priority = TaskPriority.Low });
        await _service.CreateTaskAsync(new TaskItem { Title = "High Priority", Description = "High priority task description", Priority = TaskPriority.High });

        var result = await _service.GetAllTasksAsync(priority: TaskPriority.High);

        result.Should().HaveCount(1);
        result.First().Priority.Should().Be(TaskPriority.High);
    }

    [Fact]
    public async Task UpdateTaskAsync_ShouldUpdateTask_WhenTaskExists()
    {
        var task = await _service.CreateTaskAsync(new TaskItem
        {
            Title = "Original Title",
            Description = "Original description for the task",
            Priority = TaskPriority.Low
        });

        var updatedTask = new TaskItem
        {
            Title = "Updated Title",
            Description = "Updated description for the task",
            Priority = TaskPriority.High,
            Status = TaskItemStatus.InProgress
        };

        var result = await _service.UpdateTaskAsync(task.Id, updatedTask);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Updated Title");
        result.Priority.Should().Be(TaskPriority.High);
        result.Status.Should().Be(TaskItemStatus.InProgress);
        result.UpdatedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task UpdateTaskAsync_ShouldSetCompletedAt_WhenStatusChangesToCompleted()
    {
        var task = await _service.CreateTaskAsync(new TaskItem
        {
            Title = "Task to Complete",
            Description = "This task will be marked as completed",
            Status = TaskItemStatus.InProgress
        });

        var updatedTask = new TaskItem
        {
            Title = task.Title,
            Description = task.Description,
            Status = TaskItemStatus.Completed,
            Priority = task.Priority
        };

        var result = await _service.UpdateTaskAsync(task.Id, updatedTask);

        result.Should().NotBeNull();
        result!.Status.Should().Be(TaskItemStatus.Completed);
        result.CompletedAt.Should().NotBeNull();
        result.CompletedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task UpdateTaskAsync_ShouldClearCompletedAt_WhenStatusChangesFromCompleted()
    {
        var task = await _service.CreateTaskAsync(new TaskItem
        {
            Title = "Completed Task",
            Description = "This task was completed but will be reopened",
            Status = TaskItemStatus.Open
        });

        var completedTask = new TaskItem
        {
            Title = task.Title,
            Description = task.Description,
            Status = TaskItemStatus.Completed,
            Priority = task.Priority
        };
        await _service.UpdateTaskAsync(task.Id, completedTask);

        var reopenedTask = new TaskItem
        {
            Title = task.Title,
            Description = task.Description,
            Status = TaskItemStatus.InProgress,
            Priority = task.Priority
        };
        var result = await _service.UpdateTaskAsync(task.Id, reopenedTask);

        result.Should().NotBeNull();
        result!.Status.Should().Be(TaskItemStatus.InProgress);
        result.CompletedAt.Should().BeNull();
    }

    [Fact]
    public async Task UpdateTaskAsync_ShouldReturnNull_WhenTaskDoesNotExist()
    {
        var updatedTask = new TaskItem
        {
            Title = "Non-existent Task",
            Description = "This task does not exist in the database"
        };

        var result = await _service.UpdateTaskAsync(999, updatedTask);

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateTaskAsync_ShouldThrowException_WhenUpdatedTaskIsNull()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _service.UpdateTaskAsync(1, null!));
    }

    [Fact]
    public async Task DeleteTaskAsync_ShouldDeleteTask_WhenTaskExists()
    {
        var task = await _service.CreateTaskAsync(new TaskItem
        {
            Title = "Task to Delete",
            Description = "This task will be deleted from the database"
        });

        var result = await _service.DeleteTaskAsync(task.Id);

        result.Should().BeTrue();
        var deletedTask = await _service.GetTaskByIdAsync(task.Id);
        deletedTask.Should().BeNull();
    }

    [Fact]
    public async Task DeleteTaskAsync_ShouldReturnFalse_WhenTaskDoesNotExist()
    {
        var result = await _service.DeleteTaskAsync(999);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task GetTasksByAssigneeAsync_ShouldReturnTasksForSpecificAssignee()
    {
        await _service.CreateTaskAsync(new TaskItem { Title = "John's Task", Description = "Task assigned to John", AssignedTo = "John Doe" });
        await _service.CreateTaskAsync(new TaskItem { Title = "Jane's Task", Description = "Task assigned to Jane", AssignedTo = "Jane Smith" });
        await _service.CreateTaskAsync(new TaskItem { Title = "Another John's Task", Description = "Another task for John", AssignedTo = "John Doe" });

        var result = await _service.GetTasksByAssigneeAsync("John Doe");

        result.Should().HaveCount(2);
        result.Should().OnlyContain(t => t.AssignedTo.Equals("John Doe", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetTasksByAssigneeAsync_ShouldReturnEmpty_WhenAssigneeIsEmpty()
    {
        var result = await _service.GetTasksByAssigneeAsync("");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetTasksByCategoryAsync_ShouldReturnTasksForSpecificCategory()
    {
        await _service.CreateTaskAsync(new TaskItem { Title = "Dev Task", Description = "Development task description", Category = "Development" });
        await _service.CreateTaskAsync(new TaskItem { Title = "Bug Task", Description = "Bug fix task description", Category = "Bug Fix" });
        await _service.CreateTaskAsync(new TaskItem { Title = "Another Dev Task", Description = "Another development task", Category = "Development" });

        var result = await _service.GetTasksByCategoryAsync("Development");

        result.Should().HaveCount(2);
        result.Should().OnlyContain(t => t.Category.Equals("Development", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetTasksByCategoryAsync_ShouldReturnEmpty_WhenCategoryIsEmpty()
    {
        var result = await _service.GetTasksByCategoryAsync("");

        result.Should().BeEmpty();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
