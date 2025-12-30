namespace MusicMate.Domain.Entities;

public class Matching
{
    public Guid id { get; set; }
    public Guid first_user_id { get; set; }
    public User first_user { get; set; } = null!;

    public Guid second_user_id { get; set; }
    public User second_user { get; set; } = null!;

    public DateTime matched_time { get; set; } = DateTime.UtcNow;
}