using System.Security.Claims; 
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MusicMate.Application.Features.Chat.Commands;
using MusicMate.Application.Features.Chat.Requests;

namespace MusicMate.API.Controllers;

[Route("api/[controller]")]
[ApiController]

public class ChatController(IMediator mediator) : ControllerBase
{
    
    [HttpPost]
    [Authorize] 
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var user_id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(user_id))
        {
            return Unauthorized("Hãy Đăng Nhập.");
        }

        Guid sender_id = Guid.Parse(user_id);
        var command = new SendMessageCommand(request, sender_id);

        var result = await mediator.Send(command);
        
        return Ok(result);
    }
}