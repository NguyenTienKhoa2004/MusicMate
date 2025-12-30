using System;
using System.Collections.Generic; 

namespace MusicMate.Domain.Entities;

public class User
{
    public Guid id { get; set; }
    public string username { get; set; } = null!;
    public string email { get; set; } = null!;
    public string hashed_password { get; set; } = null!;
    public string? display_name { get; set; }
    public string? bio { get; set; }
    public string? user_avatar { get; set; }
    public DateTime create_time { get; set; } = DateTime.UtcNow;
    
    public bool IsOnline { get; set; } = false;
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
    
    public string? city { get; set; } 
    
    public ICollection<Message> sent_messages { get; set; } = new List<Message>();
    
    public ICollection<Message> received_messages { get; set; } = new List<Message>();
    
    public ICollection<UserFavoriteGenre> favorite_genres { get; set; } = new List<UserFavoriteGenre>();
    public ICollection<Matching> matches_at_first { get; set; } = new List<Matching>();
    public ICollection<Matching> matches_at_second { get; set; } = new List<Matching>();
}