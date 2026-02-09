using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Chat.DTOs;

namespace MusicMate.Application.Features.Chat.Queries;

public class GetChatHistoryQueryHandler(IMusicMateDbContext context) 
    : IRequestHandler<GetChatHistoryQuery, List<MessageDto>>
{
    public async Task<List<MessageDto>> Handle(GetChatHistoryQuery request, CancellationToken cancellationToken)
    {
        var messages = await context.Messages
            .Include(m => m.sender)
            .Where(m => 
                (m.sender_id == request.UserId1 && m.receiver_id == request.UserId2) ||
                (m.sender_id == request.UserId2 && m.receiver_id == request.UserId1))
            .OrderBy(m => m.create_time)
            .Take(request.Limit)
            .Select(m => new MessageDto
            {
                id = m.id,
                sender_id = m.sender_id,
                receiver_id = m.receiver_id,
                content = m.content,
                sent_time = m.create_time,
                sender_name = m.sender.display_name ?? m.sender.username ?? "Unknown User",
                sender_avatar = m.sender.user_avatar
            })
            .ToListAsync(cancellationToken);

        return messages;
    }
}
