using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicMate.Application.Features.Genres.Queries;
using MusicMate.Application.Features.Users.Commands;
using System.Security.Claims;

namespace MusicMate.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GenresController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetAllGenresQuery());
        return Ok(result);
    }
    
    [Authorize] 
    [HttpPost("set-favorites")]
    public async Task<IActionResult> SetFavorites([FromBody] List<int> genreIds)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized();
        var userId = Guid.Parse(userIdString);
        await mediator.Send(new SetUserGenresCommand(userId, genreIds));
        return Ok(new { Message = "Đã lưu sở thích thành công!" });
    }
}