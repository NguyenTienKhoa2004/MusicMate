using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Genres.DTOs;

namespace MusicMate.Application.Features.Genres.Queries;

// Request: Không cần tham số gì cả
public record GetAllGenresQuery : IRequest<List<GenreDto>>;

// Handler
public class GetAllGenresQueryHandler : IRequestHandler<GetAllGenresQuery, List<GenreDto>>
{
    private readonly IMusicMateDbContext _db;

    public GetAllGenresQueryHandler(IMusicMateDbContext db)
    {
        _db = db;
    }

    public async Task<List<GenreDto>> Handle(GetAllGenresQuery request, CancellationToken ct)
    {
        // Select từ Entity sang DTO
        return await _db.MusicGenres
            .Select(g => new GenreDto(g.Id, g.Name))
            .ToListAsync(ct);
    }
}