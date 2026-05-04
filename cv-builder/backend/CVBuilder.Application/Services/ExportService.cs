using System.Text.Json;

namespace CVBuilder.Application.Services;

public interface IExportService
{
    Task<byte[]> GeneratePdfAsync(string cvJson);
    Task<byte[]> GenerateDocxAsync(string cvJson);
}

public class ExportService : IExportService
{
    public async Task<byte[]> GeneratePdfAsync(string cvJson)
    {
        // Placeholder: Render HTML from CV JSON and convert to PDF via PuppeteerSharp
        var html = BuildHtml(cvJson);
        await Task.CompletedTask;
        return System.Text.Encoding.UTF8.GetBytes(html);
    }

    public async Task<byte[]> GenerateDocxAsync(string cvJson)
    {
        await Task.CompletedTask;
        return System.Text.Encoding.UTF8.GetBytes(cvJson);
    }

    private static string BuildHtml(string cvJson)
    {
        using var doc = JsonDocument.Parse(cvJson);
        var root = doc.RootElement;

        var style = root.GetProperty("style");
        var colors = style.GetProperty("colors");
        var fonts = style.GetProperty("fontSize");
        var spacing = style.GetProperty("spacing");
        var pagePad = spacing.GetProperty("pagePadding").GetInt32();

        var html = $@"<!DOCTYPE html>
<html>
<head>
<meta charset=""UTF-8"">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  body {{
    font-family: {style.GetProperty("fontFamily").GetString()}, sans-serif;
    font-size: {fonts.GetProperty("base").GetInt32()}px;
    color: {colors.GetProperty("text").GetString()};
    background: white;
    padding: {pagePad}px;
    max-width: 800px;
    margin: 0 auto;
  }}
  h1 {{ font-size: {fonts.GetProperty("heading").GetInt32()}px; color: {colors.GetProperty("primary").GetString()}; }}
  h2 {{ font-size: {fonts.GetProperty("subheading").GetInt32()}px; color: {colors.GetProperty("secondary").GetString()}; }}
  .section {{ margin-bottom: {spacing.GetProperty("sectionGap").GetInt32()}px; }}
  .item {{ margin-bottom: {spacing.GetProperty("itemGap").GetInt32()}px; }}
</style>
</head>
<body>";

        if (root.TryGetProperty("sections", out var sections))
        {
            foreach (var section in sections.EnumerateArray())
            {
                if (!section.GetProperty("visible").GetBoolean()) continue;
                var type = section.GetProperty("type").GetString();
                html += $"<div class=\"section\">";
                html += type switch
                {
                    "header" => RenderHeader(section),
                    "experience" => RenderExperience(section),
                    "education" => RenderEducation(section),
                    "skills" => RenderSkills(section),
                    _ => $"<h2>{section.GetProperty("title").GetString()}</h2>",
                };
                html += "</div>";
            }
        }

        html += "</body></html>";
        return html;
    }

    private static string RenderHeader(JsonElement s)
    {
        var d = s.GetProperty("data");
        return $@"
<h1>{d.GetProperty("fullName").GetString()}</h1>
<p><strong>{d.GetProperty("title").GetString()}</strong></p>
<p>{d.GetProperty("email").GetString()} | {d.GetProperty("phone").GetString()} | {d.GetProperty("location").GetString()}</p>
<p>{d.GetProperty("summary").GetString()}</p>";
    }

    private static string RenderExperience(JsonElement s)
    {
        var html = $"<h2>{s.GetProperty("title").GetString()}</h2>";
        foreach (var item in s.GetProperty("items").EnumerateArray())
        {
            html += $"<div class=\"item\"><strong>{item.GetProperty("position").GetString()}</strong> — {item.GetProperty("company").GetString()}<br/>";
            html += $"{item.GetProperty("startDate").GetString()} - {item.GetProperty("endDate").GetString()}<ul>";
            foreach (var bullet in item.GetProperty("bullets").EnumerateArray())
                html += $"<li>{bullet.GetString()}</li>";
            html += "</ul></div>";
        }
        return html;
    }

    private static string RenderEducation(JsonElement s)
    {
        var html = $"<h2>{s.GetProperty("title").GetString()}</h2>";
        foreach (var item in s.GetProperty("items").EnumerateArray())
        {
            html += $"<div class=\"item\"><strong>{item.GetProperty("degree").GetString()}</strong> — {item.GetProperty("major").GetString()}<br/>{item.GetProperty("institution").GetString()}, {item.GetProperty("startDate").GetString()} - {item.GetProperty("endDate").GetString()}</div>";
        }
        return html;
    }

    private static string RenderSkills(JsonElement s)
    {
        var html = $"<h2>{s.GetProperty("title").GetString()}</h2>";
        foreach (var group in s.GetProperty("groups").EnumerateArray())
        {
            html += $"<strong>{group.GetProperty("label").GetString()}:</strong> ";
            html += string.Join(", ", group.GetProperty("items").EnumerateArray().Select(i => i.GetString()));
            html += "<br/>";
        }
        return html;
    }
}
