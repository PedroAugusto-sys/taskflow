using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.IntegrationTests;

public class TaskFlowApiTests
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public TaskFlowApiTests()
    {
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<TaskFlowContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<TaskFlowContext>(options =>
                {
                    options.UseInMemoryDatabase($"InMemoryTestDb_{Guid.NewGuid()}");
                });

                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<TaskFlowContext>();
                db.Database.EnsureCreated();
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetAllTasks_ShouldReturnEmptyList_WhenNoTasksExist()
    {
        var response = await _client.GetAsync("/api/tasks");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskItemDto>>();
        tasks.Should().NotBeNull();
        tasks.Should().BeEmpty();
    }

    [Fact]
    public async Task CreateTask_ShouldReturnCreated_WithValidData()
    {
        var newTask = new CreateTaskItemDto(
            Title: "Integration Test Task",
            Description: "This is a task created during integration testing",
            Priority: TaskPriority.High,
            AssignedTo: "Test User",
            Category: "Testing"
        );

        var response = await _client.PostAsJsonAsync("/api/tasks", newTask);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdTask = await response.Content.ReadFromJsonAsync<TaskItemDto>();
        createdTask.Should().NotBeNull();
        createdTask!.Title.Should().Be(newTask.Title);
        createdTask.Status.Should().Be(TaskItemStatus.Open);
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateTask_ShouldReturnBadRequest_WithInvalidData()
    {
        var invalidTask = new CreateTaskItemDto(
            Title: "AB",
            Description: "Short",
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var response = await _client.PostAsJsonAsync("/api/tasks", invalidTask);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetTaskById_ShouldReturnTask_WhenTaskExists()
    {
        var newTask = new CreateTaskItemDto(
            Title: "Task to Retrieve",
            Description: "This task will be retrieved by its ID",
            Priority: TaskPriority.Medium,
            AssignedTo: "John Doe",
            Category: "Development"
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", newTask);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskItemDto>();

        var response = await _client.GetAsync($"/api/tasks/{createdTask!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var task = await response.Content.ReadFromJsonAsync<TaskItemDto>();
        task.Should().NotBeNull();
        task!.Id.Should().Be(createdTask.Id);
        task.Title.Should().Be(newTask.Title);
    }

    [Fact]
    public async Task GetTaskById_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        var response = await _client.GetAsync("/api/tasks/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTask_ShouldReturnOk_WithValidData()
    {
        var newTask = new CreateTaskItemDto(
            Title: "Task to Update",
            Description: "This task will be updated during testing",
            Priority: TaskPriority.Low,
            AssignedTo: "Jane Doe",
            Category: "Testing"
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", newTask);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskItemDto>();

        var updateTask = new UpdateTaskItemDto(
            Title: "Updated Task Title",
            Description: null,
            Status: TaskItemStatus.InProgress,
            Priority: TaskPriority.High,
            AssignedTo: null,
            Category: null
        );

        var response = await _client.PutAsJsonAsync($"/api/tasks/{createdTask!.Id}", updateTask);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedTask = await response.Content.ReadFromJsonAsync<TaskItemDto>();
        updatedTask.Should().NotBeNull();
        updatedTask!.Title.Should().Be(updateTask.Title);
        updatedTask.Status.Should().Be(TaskItemStatus.InProgress);
        updatedTask.Priority.Should().Be(TaskPriority.High);
        updatedTask.Description.Should().Be(newTask.Description);
    }

    [Fact]
    public async Task UpdateTask_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        var updateTask = new UpdateTaskItemDto(
            Title: "Non-existent Task",
            Description: null,
            Status: null,
            Priority: null,
            AssignedTo: null,
            Category: null
        );

        var response = await _client.PutAsJsonAsync("/api/tasks/9999", updateTask);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTask_ShouldReturnBadRequest_WithInvalidData()
    {
        var newTask = new CreateTaskItemDto(
            Title: "Valid Task",
            Description: "This task has valid data initially",
            Priority: TaskPriority.Medium,
            AssignedTo: "User",
            Category: "Category"
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", newTask);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskItemDto>();

        var invalidUpdate = new UpdateTaskItemDto(
            Title: "AB",
            Description: null,
            Status: null,
            Priority: null,
            AssignedTo: null,
            Category: null
        );

        var response = await _client.PutAsJsonAsync($"/api/tasks/{createdTask!.Id}", invalidUpdate);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task DeleteTask_ShouldReturnNoContent_WhenTaskExists()
    {
        var newTask = new CreateTaskItemDto(
            Title: "Task to Delete",
            Description: "This task will be deleted during testing",
            Priority: TaskPriority.Low,
            AssignedTo: "User",
            Category: "Testing"
        );
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", newTask);
        var createdTask = await createResponse.Content.ReadFromJsonAsync<TaskItemDto>();

        var response = await _client.DeleteAsync($"/api/tasks/{createdTask!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/tasks/{createdTask.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTask_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        var response = await _client.DeleteAsync("/api/tasks/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetAllTasks_ShouldFilterByStatus()
    {
        var task1 = new CreateTaskItemDto("Open Task", "This is an open task for filtering", TaskPriority.Low, "", "");
        var task2 = new CreateTaskItemDto("Task to Complete", "This task will be completed", TaskPriority.Medium, "", "");
        
        await _client.PostAsJsonAsync("/api/tasks", task1);
        var createResponse2 = await _client.PostAsJsonAsync("/api/tasks", task2);
        var createdTask2 = await createResponse2.Content.ReadFromJsonAsync<TaskItemDto>();

        var updateToCompleted = new UpdateTaskItemDto(null, null, TaskItemStatus.Completed, null, null, null);
        await _client.PutAsJsonAsync($"/api/tasks/{createdTask2!.Id}", updateToCompleted);

        var response = await _client.GetAsync("/api/tasks?status=3");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskItemDto>>();
        tasks.Should().NotBeNull();
        tasks!.Should().HaveCountGreaterOrEqualTo(1);
        tasks.Should().OnlyContain(t => t.Status == TaskItemStatus.Completed);
    }

    [Fact]
    public async Task GetAllTasks_ShouldFilterByPriority()
    {
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskItemDto("Low Priority", "Low priority task", TaskPriority.Low, "", ""));
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskItemDto("High Priority", "High priority task", TaskPriority.High, "", ""));

        var response = await _client.GetAsync("/api/tasks?priority=2");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskItemDto>>();
        tasks.Should().NotBeNull();
        tasks!.Should().HaveCountGreaterOrEqualTo(1);
        tasks.Should().OnlyContain(t => t.Priority == TaskPriority.High);
    }

    [Fact]
    public async Task GetTasksByAssignee_ShouldReturnTasksForSpecificUser()
    {
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskItemDto("John's Task", "Task for John", TaskPriority.Medium, "John Doe", ""));
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskItemDto("Jane's Task", "Task for Jane", TaskPriority.Medium, "Jane Smith", ""));

        var response = await _client.GetAsync("/api/tasks/assignee/John%20Doe");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskItemDto>>();
        tasks.Should().NotBeNull();
        tasks!.Should().HaveCountGreaterOrEqualTo(1);
        tasks.Should().OnlyContain(t => t.AssignedTo.Equals("John Doe", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetTasksByCategory_ShouldReturnTasksForSpecificCategory()
    {
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskItemDto("Dev Task", "Development task", TaskPriority.Medium, "", "Development"));
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskItemDto("Bug Task", "Bug fix task", TaskPriority.High, "", "Bug Fix"));

        var response = await _client.GetAsync("/api/tasks/category/Development");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var tasks = await response.Content.ReadFromJsonAsync<List<TaskItemDto>>();
        tasks.Should().NotBeNull();
        tasks!.Should().HaveCountGreaterOrEqualTo(1);
        tasks.Should().OnlyContain(t => t.Category.Equals("Development", StringComparison.OrdinalIgnoreCase));
    }
}
