namespace MusicMate.Domain.Entities;

public class Matching
{
    public Guid Id { get; set; }
    public Guid User1Id { get; set; }
    public User User1 { get; set; } = null!;

    public Guid User2Id { get; set; }
    public User User2 { get; set; } = null!;

    public DateTime MatchedAt { get; set; } = DateTime.UtcNow;
}