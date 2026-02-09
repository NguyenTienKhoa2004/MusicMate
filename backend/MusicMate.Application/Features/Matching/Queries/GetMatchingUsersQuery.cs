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
            .Where(x => x.user_id == request.CurrentUserId)
            .Select(x => x.genre_id)
            .ToListAsync(ct);

        if (!myGenreIds.Any()) return new List<MatchCandidateDto>(); 
        
        var matched_users_data = await _db.Users
            .Where(u => u.id != request.CurrentUserId)
            .Select(u => new
            {
                User = u,
                CommonGenreCount = u.favorite_genres.Count(fg => myGenreIds.Contains(fg.genre_id)),
                GenreNames = u.favorite_genres.Select(fg => new { GenreId = fg.genre_id, Name = fg.genre.name }).ToList()
            })
            .Where(x => x.CommonGenreCount > 0)
            .OrderByDescending(x => x.CommonGenreCount)
            .Take(50)
            .AsSplitQuery()
            .ToListAsync(ct);

        var result = matched_users_data.Select(u =>
        {
            var theirGenreIds = u.GenreNames.Select(g => g.GenreId).ToList();
            var sameGenres = myGenreIds.Intersect(theirGenreIds).ToList();
            
            double score = (double)sameGenres.Count / myGenreIds.Count * 100;
            
            var commonGenreNames = u.GenreNames
                .Where(g => sameGenres.Contains(g.GenreId))
                .Select(g => g.Name)
                .ToList();

            return new MatchCandidateDto
            {
                UserId = u.User.id,
                DisplayName = u.User.display_name,
                MatchPercentage = (int)Math.Round(score),
                CommonGenres = commonGenreNames
            };
        }).ToList();

        return result.OrderByDescending(x => x.MatchPercentage).ToList();
    }
}