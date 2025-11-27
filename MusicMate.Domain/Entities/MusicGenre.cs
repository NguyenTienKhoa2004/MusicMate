namespace MusicMate.Domain.Entities;

public class MusicGenre
{
    public int Id { get; set; }
    public string Name { get; set; } = null!; 
    public ICollection<UserFavoriteGenre> Users { get; set; } = new List<UserFavoriteGenre>();
}
