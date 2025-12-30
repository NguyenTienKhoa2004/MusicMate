using Microsoft.AspNetCore.SignalR;
using MusicMate.Application.Common.Interfaces; 
using MusicMate.Infrastructure.Hubs;           

namespace MusicMate.Infrastructure.Services;

public class SignalRChatNotifier : IChatNotifier
{ 
    private readonly IHubContext<ChatHub> _hubContext;

    public SignalRChatNotifier(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }
    
    public async Task SendMessageToUserAsync(string userId, object messageContent)
    {
        await _hubContext.Clients.User(userId).SendAsync("ReceiveMessage", messageContent);
    }
}