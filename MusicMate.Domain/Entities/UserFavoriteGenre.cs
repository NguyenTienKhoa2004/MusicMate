namespace MusicMate.Domain.Entities;

public class UserFavoriteGenre
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int GenreId { get; set; }
    public MusicGenre Genre { get; set; } = null!;
}