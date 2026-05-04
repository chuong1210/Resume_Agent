using CVBuilder.Application.DTOs;
using CVBuilder.Application.Interfaces;
using CVBuilder.Domain.Entities;

namespace CVBuilder.Application.Services;

public interface ICVService
{
    Task<List<CVListItemDto>> GetAllByUserAsync(Guid userId);
    Task<CVDto?> GetByIdAsync(Guid id, Guid userId);
    Task<CVDto> CreateAsync(Guid userId, CreateCVDto dto);
    Task UpdateAsync(Guid id, Guid userId, UpdateCVDto dto);
    Task SaveVersionAsync(Guid id, Guid userId, SaveVersionDto dto);
    Task<byte[]> ExportToPdfAsync(Guid id, Guid userId);
}

public class CVService : ICVService
{
    private readonly ICVRepository _repo;

    public CVService(ICVRepository repo) => _repo = repo;

    public async Task<List<CVListItemDto>> GetAllByUserAsync(Guid userId)
    {
        var cvs = await _repo.GetAllByUserIdAsync(userId);
        return cvs.Select(c => new CVListItemDto(c.Id, c.Title, c.TemplateId, c.UpdatedAt)).ToList();
    }

    public async Task<CVDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var cv = await _repo.GetByIdAsync(id, userId);
        return cv is null ? null : MapToDto(cv);
    }

    public async Task<CVDto> CreateAsync(Guid userId, CreateCVDto dto)
    {
        var cv = new CV
        {
            UserId = userId,
            Title = dto.Title,
            TemplateId = dto.TemplateId,
        };
        cv = await _repo.CreateAsync(cv);
        return MapToDto(cv);
    }

    public async Task UpdateAsync(Guid id, Guid userId, UpdateCVDto dto)
    {
        var cv = await _repo.GetByIdAsync(id, userId)
            ?? throw new KeyNotFoundException("CV not found");

        cv.ContentJson = dto.ContentJson;
        if (dto.Title is not null) cv.Title = dto.Title;
        await _repo.UpdateAsync(cv);
    }

    public async Task SaveVersionAsync(Guid id, Guid userId, SaveVersionDto dto)
    {
        var cv = await _repo.GetByIdAsync(id, userId)
            ?? throw new KeyNotFoundException("CV not found");

        await _repo.SaveVersionAsync(new CVVersion
        {
            CVId = cv.Id,
            ContentJson = cv.ContentJson,
            ChangeDescription = dto.ChangeDescription,
        });
    }

    public async Task<byte[]> ExportToPdfAsync(Guid id, Guid userId)
    {
        var cv = await _repo.GetByIdAsync(id, userId)
            ?? throw new KeyNotFoundException("CV not found");

        // Placeholder: generate PDF from CV JSON
        // In production, use PuppeteerSharp to render HTML → PDF
        var html = $"<html><body><h1>{cv.Title}</h1><pre>{cv.ContentJson}</pre></body></html>";
        return System.Text.Encoding.UTF8.GetBytes(html);
    }

    private static CVDto MapToDto(CV cv) =>
        new(cv.Id, cv.Title, cv.TemplateId, cv.ContentJson, cv.CreatedAt, cv.UpdatedAt);
}
