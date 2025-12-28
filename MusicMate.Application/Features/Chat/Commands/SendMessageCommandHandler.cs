using MediatR;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Domain.Entities;
using MusicMate.Application.Features.Chat.DTOs; 

namespace MusicMate.Application.Features.Chat.Commands;

public class SendMessageCommandHandler(IMusicMateDbContext context, IChatNotifier chatNotifier) : IRequestHandler<SendMessageCommand, MessageDto>
{
    public async Task<MessageDto> Handle(SendMessageCommand command, CancellationToken cancellationToken)
    {
        var message = new Message
        {
            sender_id = command.sender_id,
            receiver_id = command.Request.ReceiverId,
            content = command.Request.Content,
            create_time = DateTime.UtcNow
        };

        context.Messages.Add(message);
        await context.SaveChangesAsync(cancellationToken);
        
        var sender = await context.Users.FindAsync(new object[] { command.sender_id }, cancellationToken);

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

        await chatNotifier.SendMessageToUserAsync(message.receiver_id.ToString(), messageDto);
        await chatNotifier.SendMessageToUserAsync(message.sender_id.ToString(), messageDto);

        return messageDto;
    }
}