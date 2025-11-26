using Microsoft.EntityFrameworkCore;
using MusicMate.Domain.Entities;

namespace MusicMate.Application.Common.Interfaces;

public interface IMusicMateDbContext
{
    DbSet<User> Users { get; }
    DbSet<MusicGenre> MusicGenres { get; }
    DbSet<UserFavoriteGenre> UserFavoriteGenres { get; }
    DbSet<Matching> Matches { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}