using Microsoft.EntityFrameworkCore;
using MusicMate.Domain.Entities;
using MusicMate.Application.Common.Interfaces;

namespace MusicMate.Infrastructure.Persistence;

public class MusicMateDbContext : DbContext, IMusicMateDbContext
{
    public MusicMateDbContext(DbContextOptions<MusicMateDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<MusicGenre> MusicGenres => Set<MusicGenre>();
    public DbSet<UserFavoriteGenre> UserFavoriteGenres => Set<UserFavoriteGenre>();
    public DbSet<Matching> Matches => Set<Matching>();
    public DbSet<Message> Messages => Set<Message>(); // ✅ Đã thêm bảng Message

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>(eb =>
        {
            eb.HasKey(u => u.id);
            
            eb.HasIndex(u => u.email).IsUnique(); 
            eb.HasIndex(u => u.username).IsUnique();

            eb.Property(u => u.email).IsRequired().HasMaxLength(255);
            eb.Property(u => u.username).IsRequired().HasMaxLength(100);
            
            eb.Property(u => u.city).HasMaxLength(100);
        });
        
        modelBuilder.Entity<Message>(eb =>
        {
            eb.HasKey(m => m.id);
            
            eb.HasOne(m => m.sender)
              .WithMany(u => u.sent_messages) 
              .HasForeignKey(m => m.sender_id)
              .OnDelete(DeleteBehavior.Restrict); 
            
            eb.HasOne(m => m.receiver)
              .WithMany(u => u.received_messages) 
              .HasForeignKey(m => m.receiver_id)
              .OnDelete(DeleteBehavior.Restrict); 
            
            eb.HasIndex(m => m.sender_id);
            eb.HasIndex(m => m.receiver_id);
        });
        
        modelBuilder.Entity<Matching>(eb =>
        {
            eb.HasKey(m => m.id);
            
            eb.HasOne(m => m.first_user)
              .WithMany(u => u.matches_at_first)
              .HasForeignKey(m => m.first_user_id) 
              .OnDelete(DeleteBehavior.Restrict);
            
            eb.HasOne(m => m.second_user)
              .WithMany(u => u.matches_at_second)
              .HasForeignKey(m => m.second_user_id) 
              .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<UserFavoriteGenre>(eb =>
        {
            eb.HasKey(ufg => new { UserId = ufg.user_id, GenreId = ufg.genre_id });

            eb.HasOne(ufg => ufg.user)
              .WithMany(u => u.favorite_genres)
              .HasForeignKey(ufg => ufg.user_id);

            eb.HasOne(ufg => ufg.genre)
              .WithMany(g => g.users)
              .HasForeignKey(ufg => ufg.genre_id);
        });
        
        modelBuilder.Entity<MusicGenre>().HasData(
            new MusicGenre { id = 1, name = "Pop" },
            new MusicGenre { id = 2, name = "Rock" },
            new MusicGenre { id = 3, name = "Hip-Hop" },
            new MusicGenre { id = 4, name = "Ballad" },
            new MusicGenre { id = 5, name = "R&B" },
            new MusicGenre { id = 6, name = "Indie" },
            new MusicGenre { id = 7, name = "Jazz" },
            new MusicGenre { id = 8, name = "EDM" }
        );
    }
}