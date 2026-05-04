using CVBuilder.Application.Interfaces;
using CVBuilder.Domain.Entities;
using CVBuilder.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CVBuilder.Infrastructure.Repositories;

public class CVRepository : ICVRepository
{
    private readonly AppDbContext _db;

    public CVRepository(AppDbContext db) => _db = db;

    public async Task<List<CV>> GetAllByUserIdAsync(Guid userId)
    {
        return await _db.CVs
            .Where(c => c.UserId == userId && !c.IsDeleted)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();
    }

    public async Task<CV?> GetByIdAsync(Guid id, Guid userId)
    {
        return await _db.CVs
            .Include(c => c.Versions.OrderByDescending(v => v.CreatedAt).Take(10))
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId && !c.IsDeleted);
    }

    public async Task<CV> CreateAsync(CV cv)
    {
        cv.Id = Guid.NewGuid();
        cv.CreatedAt = DateTime.UtcNow;
        cv.UpdatedAt = DateTime.UtcNow;
        _db.CVs.Add(cv);
        await _db.SaveChangesAsync();
        return cv;
    }

    public async Task UpdateAsync(CV cv)
    {
        cv.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task SaveVersionAsync(CVVersion version)
    {
        version.Id = Guid.NewGuid();
        version.CreatedAt = DateTime.UtcNow;
        _db.CVVersions.Add(version);
        await _db.SaveChangesAsync();
    }

    public async Task<List<CVVersion>> GetVersionsAsync(Guid cvId)
    {
        return await _db.CVVersions
            .Where(v => v.CVId == cvId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
    }
}
