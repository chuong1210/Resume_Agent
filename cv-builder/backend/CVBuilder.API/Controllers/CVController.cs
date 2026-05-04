using CVBuilder.Application.DTOs;
using CVBuilder.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CVBuilder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CVController : ControllerBase
{
    private readonly ICVService _cvService;

    public CVController(ICVService cvService) => _cvService = cvService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();
        var cvs = await _cvService.GetAllByUserAsync(userId);
        return Ok(cvs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var cv = await _cvService.GetByIdAsync(id, User.GetUserId());
        return cv is null ? NotFound() : Ok(cv);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCVDto dto)
    {
        var cv = await _cvService.CreateAsync(User.GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = cv.Id }, cv);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCVDto dto)
    {
        try
        {
            await _cvService.UpdateAsync(id, User.GetUserId(), dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/versions")]
    public async Task<IActionResult> SaveVersion(Guid id, [FromBody] SaveVersionDto dto)
    {
        try
        {
            await _cvService.SaveVersionAsync(id, User.GetUserId(), dto);
            return Ok();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/export")]
    public async Task<IActionResult> Export(Guid id)
    {
        try
        {
            var pdfBytes = await _cvService.ExportToPdfAsync(id, User.GetUserId());
            return File(pdfBytes, "application/pdf", "cv.pdf");
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
