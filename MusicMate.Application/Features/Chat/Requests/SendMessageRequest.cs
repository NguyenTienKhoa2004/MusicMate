namespace MusicMate.Application.Features.Chat.Requests;

public class SendMessageRequest
{
    public Guid ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
}