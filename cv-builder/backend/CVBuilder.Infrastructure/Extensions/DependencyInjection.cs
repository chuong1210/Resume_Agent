using CVBuilder.Application.Interfaces;
using CVBuilder.Infrastructure.Data;
using CVBuilder.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CVBuilder.Infrastructure.Extensions;

public static class DependencyInjection
{
    /// <summary>
    /// Register all infrastructure services: PostgreSQL via EF Core, repositories.
    /// </summary>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Connection string 'Default' not found.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString, npgsqlOptions =>
                npgsqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

        // Repositories
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<ICVRepository, CVRepository>();

        return services;
    }
}
