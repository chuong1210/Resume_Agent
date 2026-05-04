namespace CVBuilder.Application.DTOs;

public record CreateCVDto(string Title, string TemplateId);

public record UpdateCVDto(string ContentJson, string? Title = null);

public record SaveVersionDto(string ChangeDescription);

public record ExportDto(string Format = "pdf");

public record CVListItemDto(Guid Id, string Title, string TemplateId, DateTime UpdatedAt);

public record CVDto(
    Guid Id,
    string Title,
    string TemplateId,
    string ContentJson,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
