using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;
using TaskFlow.Api.Services;
using TaskFlow.Api.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TaskFlow API",
        Version = "v1",
        Description = "A task management system API built with ASP.NET Core 8",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Pedro Augusto",
            Url = new Uri("https://pedrodevx.netlify.app")
        }
    });
});

builder.Services.AddDbContext<TaskFlowContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=taskflow.db"));

builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IValidator<CreateTaskItemDto>, CreateTaskItemValidator>();
builder.Services.AddScoped<IValidator<UpdateTaskItemDto>, UpdateTaskItemValidator>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TaskFlowContext>();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskFlow API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseCors();
app.UseHttpsRedirection();

app.MapGet("/api/tasks", async (ITaskService taskService, TaskItemStatus? status, TaskPriority? priority) =>
{
    var tasks = await taskService.GetAllTasksAsync(status, priority);
    return Results.Ok(tasks.Select(t => new TaskItemDto(
        t.Id, t.Title, t.Description, t.Status, t.Priority,
        t.CreatedAt, t.UpdatedAt, t.CompletedAt, t.AssignedTo, t.Category
    )));
})
.WithName("GetAllTasks")
.WithOpenApi()
.Produces<IEnumerable<TaskItemDto>>(200);

app.MapGet("/api/tasks/{id:int}", async (int id, ITaskService taskService) =>
{
    var task = await taskService.GetTaskByIdAsync(id);
    if (task == null)
    {
        return Results.NotFound(new { message = $"Task with ID {id} not found" });
    }

    return Results.Ok(new TaskItemDto(
        task.Id, task.Title, task.Description, task.Status, task.Priority,
        task.CreatedAt, task.UpdatedAt, task.CompletedAt, task.AssignedTo, task.Category
    ));
})
.WithName("GetTaskById")
.WithOpenApi()
.Produces<TaskItemDto>(200)
.Produces(404);

app.MapPost("/api/tasks", async (CreateTaskItemDto dto, ITaskService taskService, IValidator<CreateTaskItemDto> validator) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.BadRequest(new { errors = validationResult.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });
    }

    var task = new TaskItem
    {
        Title = dto.Title,
        Description = dto.Description,
        Priority = dto.Priority,
        AssignedTo = dto.AssignedTo,
        Category = dto.Category
    };

    var createdTask = await taskService.CreateTaskAsync(task);

    return Results.Created($"/api/tasks/{createdTask.Id}", new TaskItemDto(
        createdTask.Id, createdTask.Title, createdTask.Description, createdTask.Status, createdTask.Priority,
        createdTask.CreatedAt, createdTask.UpdatedAt, createdTask.CompletedAt, createdTask.AssignedTo, createdTask.Category
    ));
})
.WithName("CreateTask")
.WithOpenApi()
.Produces<TaskItemDto>(201)
.Produces(400);

app.MapPut("/api/tasks/{id:int}", async (int id, UpdateTaskItemDto dto, ITaskService taskService, IValidator<UpdateTaskItemDto> validator) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.BadRequest(new { errors = validationResult.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });
    }

    var existingTask = await taskService.GetTaskByIdAsync(id);
    if (existingTask == null)
    {
        return Results.NotFound(new { message = $"Task with ID {id} not found" });
    }

    var updatedTask = new TaskItem
    {
        Id = existingTask.Id,
        Title = dto.Title ?? existingTask.Title,
        Description = dto.Description ?? existingTask.Description,
        Status = dto.Status ?? existingTask.Status,
        Priority = dto.Priority ?? existingTask.Priority,
        AssignedTo = dto.AssignedTo ?? existingTask.AssignedTo,
        Category = dto.Category ?? existingTask.Category,
        CreatedAt = existingTask.CreatedAt,
        UpdatedAt = existingTask.UpdatedAt,
        CompletedAt = existingTask.CompletedAt
    };

    var result = await taskService.UpdateTaskAsync(id, updatedTask);
    if (result == null)
    {
        return Results.NotFound(new { message = $"Task with ID {id} not found" });
    }

    return Results.Ok(new TaskItemDto(
        result.Id, result.Title, result.Description, result.Status, result.Priority,
        result.CreatedAt, result.UpdatedAt, result.CompletedAt, result.AssignedTo, result.Category
    ));
})
.WithName("UpdateTask")
.WithOpenApi()
.Produces<TaskItemDto>(200)
.Produces(400)
.Produces(404);

app.MapDelete("/api/tasks/{id:int}", async (int id, ITaskService taskService) =>
{
    var deleted = await taskService.DeleteTaskAsync(id);
    if (!deleted)
    {
        return Results.NotFound(new { message = $"Task with ID {id} not found" });
    }

    return Results.NoContent();
})
.WithName("DeleteTask")
.WithOpenApi()
.Produces(204)
.Produces(404);

app.MapGet("/api/tasks/assignee/{assignee}", async (string assignee, ITaskService taskService) =>
{
    var tasks = await taskService.GetTasksByAssigneeAsync(assignee);
    return Results.Ok(tasks.Select(t => new TaskItemDto(
        t.Id, t.Title, t.Description, t.Status, t.Priority,
        t.CreatedAt, t.UpdatedAt, t.CompletedAt, t.AssignedTo, t.Category
    )));
})
.WithName("GetTasksByAssignee")
.WithOpenApi()
.Produces<IEnumerable<TaskItemDto>>(200);

app.MapGet("/api/tasks/category/{category}", async (string category, ITaskService taskService) =>
{
    var tasks = await taskService.GetTasksByCategoryAsync(category);
    return Results.Ok(tasks.Select(t => new TaskItemDto(
        t.Id, t.Title, t.Description, t.Status, t.Priority,
        t.CreatedAt, t.UpdatedAt, t.CompletedAt, t.AssignedTo, t.Category
    )));
})
.WithName("GetTasksByCategory")
.WithOpenApi()
.Produces<IEnumerable<TaskItemDto>>(200);

app.Run();

public partial class Program { }
