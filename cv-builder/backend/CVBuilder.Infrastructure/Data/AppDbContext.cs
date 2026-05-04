using Microsoft.EntityFrameworkCore;
using CVBuilder.Domain.Entities;

namespace CVBuilder.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<CV> CVs => Set<CV>();
    public DbSet<CVVersion> CVVersions => Set<CVVersion>();
    public DbSet<Template> Templates => Set<Template>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.FullName).HasMaxLength(256);
            e.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<CV>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.UserId);
            e.HasOne(c => c.User).WithMany(u => u.CVs).HasForeignKey(c => c.UserId);
            e.Property(c => c.Title).HasMaxLength(256);
            e.Property(c => c.TemplateId).HasMaxLength(64);
            e.Property(c => c.ContentJson).HasColumnType("jsonb");
        });

        modelBuilder.Entity<CVVersion>(e =>
        {
            e.HasKey(v => v.Id);
            e.HasOne(v => v.CV).WithMany(c => c.Versions).HasForeignKey(v => v.CVId);
            e.Property(v => v.ContentJson).HasColumnType("jsonb");
            e.Property(v => v.ChangeDescription).HasMaxLength(512);
        });

        modelBuilder.Entity<Template>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Name).HasMaxLength(128).IsRequired();
            e.Property(t => t.DefaultContentJson).HasColumnType("jsonb");
        });
    }
}
