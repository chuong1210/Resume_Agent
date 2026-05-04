using CVBuilder.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CVBuilder.Application.Extensions;

public static class DependencyInjection
{
    /// <summary>
    /// Register all application-layer services.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICVService, CVService>();
        services.AddScoped<IExportService, ExportService>();

        return services;
    }
}
