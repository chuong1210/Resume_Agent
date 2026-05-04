namespace CVBuilder.Domain.Entities;

public class CVVersion
{
    public Guid Id { get; set; }
    public Guid CVId { get; set; }
    public string ContentJson { get; set; } = "{}";
    public string? ChangeDescription { get; set; }
    public DateTime CreatedAt { get; set; }

    public CV CV { get; set; } = null!;
}
