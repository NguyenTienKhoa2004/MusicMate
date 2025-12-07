using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicMate.Application.Features.Matching.Queries;
using System.Security.Claims;

namespace MusicMate.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] 
public class MatchingController(IMediator _mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> FindMatches()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

        var query = new GetMatchingUsersQuery(Guid.Parse(userIdString));
        var result = await _mediator.Send(query);

        return Ok(result);
    }
}