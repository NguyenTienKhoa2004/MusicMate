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
        
        var matched_users = await _db.Users
            .Include(u => u.FavoriteGenres)
            .ThenInclude(fg => fg.Genre)
            .Where(u => u.Id != request.CurrentUserId) 
            .Where(u => u.FavoriteGenres.Any(fg => myGenreIds.Contains(fg.GenreId))) 
            .Select(u => new 
            {
                User = u,
                GenreNames = u.FavoriteGenres.Select(fg => new { fg.GenreId, fg.Genre.Name }).ToList() 
            })
            .Take(50) 
            .ToListAsync(ct);
        
        var result = new List<MatchCandidateDto>();

        foreach (var each_user in matched_users)
        {
            var theirGenreIds = each_user.GenreNames.Select(g => g.GenreId).ToList();
            var sameGenres = myGenreIds.Intersect(theirGenreIds).ToList();
            
            double score = (double)sameGenres.Count / myGenreIds.Count * 100;
            
            var commonGenreNames = each_user.GenreNames
                .Where(g => sameGenres.Contains(g.GenreId))
                .Select(g => g.Name)
                .ToList();

            result.Add(new MatchCandidateDto
            {
                UserId = each_user.User.Id,
                DisplayName = each_user.User.DisplayName,
                MatchPercentage = (int)score,
                CommonGenres = commonGenreNames
            });
        }
        return result.OrderByDescending(x => x.MatchPercentage).ToList();
    }
}