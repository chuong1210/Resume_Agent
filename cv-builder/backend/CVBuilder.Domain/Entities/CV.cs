namespace CVBuilder.Domain.Entities;

public class CV
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string TemplateId { get; set; } = string.Empty;
    public string ContentJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }

    public User User { get; set; } = null!;
    public ICollection<CVVersion> Versions { get; set; } = new List<CVVersion>();
}
