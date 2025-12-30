using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Genres.DTOs;

namespace MusicMate.Application.Features.Genres.Queries;

public record GetAllGenresQuery : IRequest<List<GenreDto>>;

public class GetAllGenresQueryHandler(IMusicMateDbContext db) : IRequestHandler<GetAllGenresQuery, List<GenreDto>>
{
    
    public async Task<List<GenreDto>> Handle(GetAllGenresQuery request, CancellationToken ct)
    {
        return await db.MusicGenres
            .Select(g => new GenreDto(g.id, g.name))
            .ToListAsync(ct);
    }
}