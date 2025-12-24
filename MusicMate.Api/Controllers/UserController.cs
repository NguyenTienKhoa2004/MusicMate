using MediatR;
using Microsoft.AspNetCore.Mvc;
using MusicMate.Application.Features.Users.Queries;
using System;
using System.Threading.Tasks;

namespace MusicMate.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(IMediator mediator) : ControllerBase
    {
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchTerm, [FromQuery] Guid currentUserId, [FromQuery] int limit = 20)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest("Search term is required.");
            }

            var query = new SearchUsersQuery { SearchTerm = searchTerm, CurrentUserId = currentUserId, Limit = limit };
            var results = await mediator.Send(query);
            return Ok(results);
        }
    }
}