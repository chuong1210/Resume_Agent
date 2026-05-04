using Microsoft.AspNetCore.Mvc;

namespace CVBuilder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplateController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var templates = new[]
        {
            new { id = "modern", name = "Modern", description = "Clean modern layout with blue accents", thumbnailUrl = "/templates/modern.png" },
            new { id = "classic", name = "Classic", description = "Traditional single-column format", thumbnailUrl = "/templates/classic.png" },
            new { id = "minimal", name = "Minimal", description = "Minimalist design with strong typography", thumbnailUrl = "/templates/minimal.png" },
            new { id = "sidebar", name = "Sidebar", description = "Two-column with colored sidebar", thumbnailUrl = "/templates/sidebar.png" },
        };
        return Ok(templates);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var template = id switch
        {
            "modern" => GetModernTemplate(),
            "classic" => GetClassicTemplate(),
            "minimal" => GetMinimalTemplate(),
            "sidebar" => GetSidebarTemplate(),
            _ => null,
        };

        return template is null ? NotFound() : Ok(template);
    }

    private static object GetModernTemplate() => new
    {
        id = "modern",
        name = "Modern",
        defaultStyle = new
        {
            fontFamily = "Inter",
            fontSize = new { @base = 14, heading = 20, subheading = 16 },
            colors = new { primary = "#1a56db", secondary = "#374151", accent = "#e5edff", text = "#111827", background = "#ffffff" },
            spacing = new { sectionGap = 24, itemGap = 12, pagePadding = 40 },
            layout = "single-column",
        },
    };

    private static object GetClassicTemplate() => new
    {
        id = "classic",
        name = "Classic",
        defaultStyle = new
        {
            fontFamily = "Merriweather",
            fontSize = new { @base = 12, heading = 16, subheading = 14 },
            colors = new { primary = "#1a1a1a", secondary = "#4a4a4a", accent = "#f5f5f5", text = "#111827", background = "#ffffff" },
            spacing = new { sectionGap = 20, itemGap = 10, pagePadding = 36 },
            layout = "single-column",
        },
    };

    private static object GetMinimalTemplate() => new
    {
        id = "minimal",
        name = "Minimal",
        defaultStyle = new
        {
            fontFamily = "Roboto",
            fontSize = new { @base = 13, heading = 18, subheading = 15 },
            colors = new { primary = "#2563eb", secondary = "#6b7280", accent = "#f8fafc", text = "#1e293b", background = "#ffffff" },
            spacing = new { sectionGap = 22, itemGap = 10, pagePadding = 32 },
            layout = "single-column",
        },
    };

    private static object GetSidebarTemplate() => new
    {
        id = "sidebar",
        name = "Sidebar",
        defaultStyle = new
        {
            fontFamily = "Inter",
            fontSize = new { @base = 12, heading = 16, subheading = 14 },
            colors = new { primary = "#1e3a5f", secondary = "#475569", accent = "#1e3a5f", text = "#1e293b", background = "#ffffff" },
            spacing = new { sectionGap = 18, itemGap = 8, pagePadding = 0 },
            layout = "sidebar",
        },
    };
}
