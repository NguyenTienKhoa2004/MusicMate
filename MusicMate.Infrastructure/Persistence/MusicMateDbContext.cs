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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MusicGenre>().HasData(
            new MusicGenre { Id = 1, Name = "Pop" },
            new MusicGenre { Id = 2, Name = "Rock" },
            new MusicGenre { Id = 3, Name = "Hip-Hop" },
            new MusicGenre { Id = 4, Name = "Ballad" },
            new MusicGenre { Id = 5, Name = "R&B" },
            new MusicGenre { Id = 6, Name = "Indie" }
        );
        modelBuilder.Entity<Matching>(eb =>
        {
            eb.HasKey(m => m.Id);

            eb.HasOne(m => m.User1)
              .WithMany(u => u.MatchesAsUser1)
              .HasForeignKey(m => m.User1Id)
              .OnDelete(DeleteBehavior.Restrict);

            eb.HasOne(m => m.User2)
              .WithMany(u => u.MatchesAsUser2)
              .HasForeignKey(m => m.User2Id)
              .OnDelete(DeleteBehavior.Restrict);
        });

    
        modelBuilder.Entity<UserFavoriteGenre>(eb =>
        {
            eb.HasKey(ufg => new { ufg.UserId, ufg.GenreId });

            eb.HasOne(ufg => ufg.User)
              .WithMany(u => u.FavoriteGenres)
              .HasForeignKey(ufg => ufg.UserId);

            eb.HasOne(ufg => ufg.Genre)
              .WithMany(g => g.Users)
              .HasForeignKey(ufg => ufg.GenreId);
        });
    }
}