using System;

namespace MusicMate.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string HashedPassword { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<UserFavoriteGenre> FavoriteGenres { get; set; } = new List<UserFavoriteGenre>();
    public ICollection<Matching> MatchesAsUser1 { get; set; } = new List<Matching>();
    public ICollection<Matching> MatchesAsUser2 { get; set; } = new List<Matching>();
}