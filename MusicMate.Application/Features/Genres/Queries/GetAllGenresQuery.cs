using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Genres.DTOs;

namespace MusicMate.Application.Features.Genres.Queries;

public record GetAllGenresQuery : IRequest<List<GenreDto>>;

public class GetAllGenresQueryHandler : IRequestHandler<GetAllGenresQuery, List<GenreDto>>
{
    private readonly IMusicMateDbContext _db;

    public GetAllGenresQueryHandler(IMusicMateDbContext db)
    {
        _db = db;
    }

    public async Task<List<GenreDto>> Handle(GetAllGenresQuery request, CancellationToken ct)
    {
        return await _db.MusicGenres
            .Select(g => new GenreDto(g.Id, g.Name))
            .ToListAsync(ct);
    }
}