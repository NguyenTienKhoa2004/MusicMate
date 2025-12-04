using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Domain.Entities;

namespace MusicMate.Application.Features.Users.Commands;

public record SetUserGenresCommand(Guid UserId, List<int> GenreIds) : IRequest<bool>;

public class SetUserGenresCommandHandler : IRequestHandler<SetUserGenresCommand, bool>
{
    private readonly IMusicMateDbContext _db;

    public SetUserGenresCommandHandler(IMusicMateDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(SetUserGenresCommand request, CancellationToken ct)
    {
        var oldGenres = await _db.UserFavoriteGenres
            .Where(x => x.UserId == request.UserId)
            .ToListAsync(ct);
        
        if (oldGenres.Any())
        {
            _db.UserFavoriteGenres.RemoveRange(oldGenres);
        }
        
        var newGenres = request.GenreIds.Select(genreId => new UserFavoriteGenre
        {
            UserId = request.UserId,
            GenreId = genreId
        });

        await _db.UserFavoriteGenres.AddRangeAsync(newGenres, ct);
        
        await _db.SaveChangesAsync(ct);

        return true;
    }
}