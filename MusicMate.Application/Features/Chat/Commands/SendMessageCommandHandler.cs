using MediatR;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Domain.Entities;
using MusicMate.Application.Features.Chat.DTOs; 

namespace MusicMate.Application.Features.Chat.Commands;

public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, MessageDto>
{
    private readonly IMusicMateDbContext _context;
    private readonly IChatNotifier _chatNotifier;

    public SendMessageCommandHandler(IMusicMateDbContext context, IChatNotifier chatNotifier)
    {
        _context = context;
        _chatNotifier = chatNotifier;
    }
    public async Task<MessageDto> Handle(SendMessageCommand command, CancellationToken cancellationToken)
    {
        var message = new Message
        {
            sender_id = command.sender_id,
            receiver_id = command.Request.ReceiverId,
            content = command.Request.Content,
            create_time = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);
        
        var sender = await _context.Users.FindAsync(new object[] { command.sender_id }, cancellationToken);

        var messageDto = new MessageDto
        {
            id = message.id,
            sender_id = message.sender_id,
            receiver_id = message.receiver_id,
            content = message.content,
            sent_time = message.create_time,
            sender_name = sender?.display_name ?? sender?.username ?? "Unknown User",
            sender_avatar = sender?.user_avatar
        };

        await _chatNotifier.SendMessageToUserAsync(message.receiver_id.ToString(), messageDto);

        return messageDto;
    }
}