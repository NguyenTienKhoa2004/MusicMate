namespace MusicMate.Domain.Entities;

public class MusicGenre
{
    public int id { get; set; }
    public string name { get; set; } = null!; 
    public ICollection<UserFavoriteGenre> users { get; set; } = new List<UserFavoriteGenre>();
}
