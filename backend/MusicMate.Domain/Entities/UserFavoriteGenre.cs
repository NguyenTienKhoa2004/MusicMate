namespace MusicMate.Domain.Entities;

public class UserFavoriteGenre
{
    public Guid user_id { get; set; }
    public User user { get; set; } = null!;

    public int genre_id { get; set; }
    public MusicGenre genre { get; set; } = null!;
}