namespace MusicMate.Domain.Entities;

public class MusicGenre
{
    public int Id { get; set; }
    public string Name { get; set; } = null!; // V-Pop, K-Pop, US-UK, Ballad, EDM...
    public string? SpotifyGenreId { get; set; } // để sau sync với Spotify API

    public ICollection<UserFavoriteGenre> Users { get; set; } = new List<UserFavoriteGenre>();
}