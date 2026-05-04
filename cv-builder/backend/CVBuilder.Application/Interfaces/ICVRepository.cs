using CVBuilder.Domain.Entities;

namespace CVBuilder.Application.Interfaces;

public interface ICVRepository
{
    Task<List<CV>> GetAllByUserIdAsync(Guid userId);
    Task<CV?> GetByIdAsync(Guid id, Guid userId);
    Task<CV> CreateAsync(CV cv);
    Task UpdateAsync(CV cv);
    Task SaveVersionAsync(CVVersion version);
    Task<List<CVVersion>> GetVersionsAsync(Guid cvId);
}
