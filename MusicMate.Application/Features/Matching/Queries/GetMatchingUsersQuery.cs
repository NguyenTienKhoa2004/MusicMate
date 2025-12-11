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
        
        var matched_users = await _db.Users
            .Include(u => u.favorite_genres)
            .ThenInclude(fg => fg.genre)
            .Where(u => u.id != request.CurrentUserId) 
            .Where(u => u.favorite_genres.Any(fg => myGenreIds.Contains(fg.genre_id))) 
            .Select(u => new 
            {
                User = u,
                GenreNames = u.favorite_genres.Select(fg => new { GenreId = fg.genre_id, Name = fg.genre.name }).ToList() 
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
                UserId = each_user.User.id,
                DisplayName = each_user.User.display_name,
                MatchPercentage = (int)score,
                CommonGenres = commonGenreNames
            });
        }
        return result.OrderByDescending(x => x.MatchPercentage).ToList();
    }
}