using FluentValidation;
using TaskFlow.Api.DTOs;

namespace TaskFlow.Api.Validators;

public class UpdateTaskItemValidator : AbstractValidator<UpdateTaskItemDto>
{
    public UpdateTaskItemValidator()
    {
        When(x => x.Title != null, () =>
        {
            RuleFor(x => x.Title)
                .MinimumLength(3).WithMessage("Title must be at least 3 characters")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters");
        });

        When(x => x.Description != null, () =>
        {
            RuleFor(x => x.Description)
                .MinimumLength(10).WithMessage("Description must be at least 10 characters")
                .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");
        });

        When(x => x.Status.HasValue, () =>
        {
            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid status value");
        });

        When(x => x.Priority.HasValue, () =>
        {
            RuleFor(x => x.Priority)
                .IsInEnum().WithMessage("Invalid priority value");
        });

        When(x => x.AssignedTo != null, () =>
        {
            RuleFor(x => x.AssignedTo)
                .MaximumLength(100).WithMessage("AssignedTo must not exceed 100 characters");
        });

        When(x => x.Category != null, () =>
        {
            RuleFor(x => x.Category)
                .MaximumLength(50).WithMessage("Category must not exceed 50 characters");
        });
    }
}
