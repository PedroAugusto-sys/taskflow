using TaskFlow.Api.Models;

namespace TaskFlow.Api.DTOs;

public record TaskItemDto(
    int Id,
    string Title,
    string Description,
    TaskItemStatus Status,
    TaskPriority Priority,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? CompletedAt,
    string AssignedTo,
    string Category
);

public record CreateTaskItemDto(
    string Title,
    string Description,
    TaskPriority Priority,
    string AssignedTo,
    string Category
);

public record UpdateTaskItemDto(
    string? Title,
    string? Description,
    TaskItemStatus? Status,
    TaskPriority? Priority,
    string? AssignedTo,
    string? Category
);
