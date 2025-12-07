using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Matching.DTOs;

namespace MusicMate.Application.Features.Matching.Queries;

public record GetMatchingUsersQuery(Guid CurrentUserId) : IRequest<List<MatchCandidateDto>>;

public class GetMatchingUsersQueryHandler(IMusicMateDbContext _db) : IRequestHandler<GetMatchingUsersQuery, List<MatchCandidateDto>>
{
    public async Task<List<MatchCandidateDto>> Handle(GetMatchingUsersQuery request, CancellationToken ct)
    {
        var myGenreIds = await _db.UserFavoriteGenres
            .Where(x => x.UserId == request.CurrentUserId)
            .Select(x => x.GenreId)
            .ToListAsync(ct);

        if (!myGenreIds.Any()) return new List<MatchCandidateDto>(); 
        
        var candidates = await _db.Users
            .Include(u => u.FavoriteGenres)
            .ThenInclude(fg => fg.Genre)
            .Where(u => u.Id != request.CurrentUserId) // Khác mình
            .Where(u => u.FavoriteGenres.Any(fg => myGenreIds.Contains(fg.GenreId))) 
            .Select(u => new 
            {
                User = u,
                GenreNames = u.FavoriteGenres.Select(fg => new { fg.GenreId, fg.Genre.Name }).ToList() 
            })
            .Take(50) 
            .ToListAsync(ct);
        
        var result = new List<MatchCandidateDto>();

        foreach (var item in candidates)
        {
            var theirGenreIds = item.GenreNames.Select(g => g.GenreId).ToList();
            var commonGenreIds = myGenreIds.Intersect(theirGenreIds).ToList();
            
            double score = (double)commonGenreIds.Count / myGenreIds.Count * 100;
            
            var commonGenreNames = item.GenreNames
                .Where(g => commonGenreIds.Contains(g.GenreId))
                .Select(g => g.Name)
                .ToList();

            result.Add(new MatchCandidateDto
            {
                UserId = item.User.Id,
                DisplayName = item.User.DisplayName,
                MatchPercentage = (int)score,
                CommonGenres = commonGenreNames
            });
        }
        return result.OrderByDescending(x => x.MatchPercentage).ToList();
    }
}