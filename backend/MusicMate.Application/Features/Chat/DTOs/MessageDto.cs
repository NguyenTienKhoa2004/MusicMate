namespace MusicMate.Application.Features.Chat.DTOs;

public class MessageDto
{
    public int id { get; set; } 
    
    public Guid sender_id { get; set; }
    public Guid receiver_id { get; set; }
    
    public string content { get; set; } = string.Empty;
    public DateTime sent_time { get; set; }
    
    public string? sender_name { get; set; } 
    public string? sender_avatar { get; set; }
}