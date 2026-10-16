using FluentAssertions;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;
using TaskFlow.Api.Validators;

namespace TaskFlow.Tests.Validators;

public class CreateTaskItemValidatorTests
{
    private readonly CreateTaskItemValidator _validator = new();

    [Fact]
    public void Validate_ShouldPass_WithValidData()
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Task Title",
            Description: "This is a valid description with enough characters",
            Priority: TaskPriority.Medium,
            AssignedTo: "John Doe",
            Category: "Development"
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Validate_ShouldFail_WhenTitleIsEmpty(string? title)
    {
        var dto = new CreateTaskItemDto(
            Title: title!,
            Description: "Valid description with enough characters",
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void Validate_ShouldFail_WhenTitleIsTooShort()
    {
        var dto = new CreateTaskItemDto(
            Title: "AB",
            Description: "Valid description with enough characters",
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title" && e.ErrorMessage.Contains("at least 3 characters"));
    }

    [Fact]
    public void Validate_ShouldFail_WhenTitleIsTooLong()
    {
        var dto = new CreateTaskItemDto(
            Title: new string('A', 201),
            Description: "Valid description with enough characters",
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title" && e.ErrorMessage.Contains("must not exceed 200 characters"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Validate_ShouldFail_WhenDescriptionIsEmpty(string? description)
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Title",
            Description: description!,
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description");
    }

    [Fact]
    public void Validate_ShouldFail_WhenDescriptionIsTooShort()
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Title",
            Description: "Short",
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description" && e.ErrorMessage.Contains("at least 10 characters"));
    }

    [Fact]
    public void Validate_ShouldFail_WhenDescriptionIsTooLong()
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Title",
            Description: new string('A', 2001),
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description" && e.ErrorMessage.Contains("must not exceed 2000 characters"));
    }

    [Fact]
    public void Validate_ShouldFail_WhenPriorityIsInvalid()
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Title",
            Description: "Valid description with enough characters",
            Priority: (TaskPriority)999,
            AssignedTo: "",
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Priority");
    }

    [Fact]
    public void Validate_ShouldFail_WhenAssignedToIsTooLong()
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Title",
            Description: "Valid description with enough characters",
            Priority: TaskPriority.Medium,
            AssignedTo: new string('A', 101),
            Category: ""
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "AssignedTo" && e.ErrorMessage.Contains("must not exceed 100 characters"));
    }

    [Fact]
    public void Validate_ShouldFail_WhenCategoryIsTooLong()
    {
        var dto = new CreateTaskItemDto(
            Title: "Valid Title",
            Description: "Valid description with enough characters",
            Priority: TaskPriority.Medium,
            AssignedTo: "",
            Category: new string('A', 51)
        );

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Category" && e.ErrorMessage.Contains("must not exceed 50 characters"));
    }
}
