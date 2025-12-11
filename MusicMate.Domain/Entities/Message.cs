namespace MusicMate.Domain.Entities;

public class Message
{
    public int id { get; set; }
    public Guid sender_id { get; set; }
    public Guid receiver_id { get; set; }
    public string content { get; set; } = string.Empty;
    public DateTime create_time { get; set; } = DateTime.UtcNow;
    
    public User sender { get; set; }
    public User receiver { get; set; }
}